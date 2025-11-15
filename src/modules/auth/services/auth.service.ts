import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { HashService } from 'src/modules/common/services/hash.service';

import {
    NON_REMEMBER_EXPIRATION,
    REMEMBER_ME_EXPIRATION,
} from 'src/lib/constants';
import { UserResponseDto } from 'src/modules/users/dtos';
import { UserAuthenticationService } from 'src/modules/users/services/user-authentication.service';
import { UserService } from 'src/modules/users/services/user.service';
import { AuthResponseDto } from '../dtos/auth.response.dto';
import { AuthSignInDto } from '../dtos/auth.sign-in.dto';
import { AuthSignUpDto } from '../dtos/auth.sign-up.dto';
import { UserCreatedEvent } from '../events/user-created.event';
import {
    IAuthPayload,
    ITokenResponse,
    TokenType,
} from '../interfaces/auth.interface';

@Injectable()
export class AuthService {
    private readonly accessTokenSecret: string;
    private readonly refreshTokenSecret: string;
    private readonly accessTokenExp: string;
    private readonly refreshTokenExp: string;

    constructor(
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly hashService: HashService,
        private readonly userService: UserService,
        private readonly userAuthService: UserAuthenticationService,
        private readonly eventEmitter: EventEmitter2
    ) {
        this.accessTokenSecret = this.configService.getOrThrow<string>(
            'auth.accessToken.secret'
        );
        this.refreshTokenSecret = this.configService.getOrThrow<string>(
            'auth.refreshToken.secret'
        );
        this.accessTokenExp = this.configService.getOrThrow<string>(
            'auth.accessToken.expiresIn'
        );
        this.refreshTokenExp = this.configService.getOrThrow<string>(
            'auth.refreshToken.expiresIn'
        );
    }

    async signIn(data: AuthSignInDto): Promise<AuthResponseDto> {
        const { email, password, rememberMe } = data;
        const user = await this.userService.findUserByEmail(email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await this.hashService.matchAsync(
            user.password!,
            password
        );

        if (!isPasswordValid) {
            throw new NotFoundException('Invalid email or password');
        }

        const expiresIn = rememberMe
            ? REMEMBER_ME_EXPIRATION
            : NON_REMEMBER_EXPIRATION;
        const tokens = await this.generateTokens(
            {
                id: user.id,
                role: user.role,
                image: user.image ?? undefined,
                tokenType: TokenType.ACCESS_TOKEN,
            },
            expiresIn
        );

        const safeUser = plainToInstance(UserResponseDto, user);

        return { ...tokens, user: safeUser };
    }

    async signUp(data: AuthSignUpDto): Promise<void> {
        const { email, password } = data;
        const existingUser = await this.userService.findUserByEmail(email);

        if (existingUser) {
            throw new ConflictException('User already exists with this email');
        }

        const hashedPassword = await this.hashService.createHashAsync(password);
        const createdUser = await this.userService.createUser({
            email,
            password: hashedPassword,
        });

        if (!createdUser?.id || !createdUser?.role) {
            throw new BadRequestException('Failed to create user');
        }

        this.eventEmitter.emit(
            'user.created',
            new UserCreatedEvent(createdUser.id)
        );
    }

    async signOut(userId: string): Promise<void> {
        await this.userAuthService.deleteRefreshToken(userId);
    }

    private async generateTokens(
        user: IAuthPayload,
        expiresIn?: number
    ): Promise<ITokenResponse> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    id: user.id,
                    role: user.role,
                    tokenType: TokenType.ACCESS_TOKEN,
                },
                {
                    secret: this.accessTokenSecret,
                    expiresIn: Number(this.accessTokenExp),
                }
            ),
            this.jwtService.signAsync(
                {
                    id: user.id,
                    role: user.role,
                    tokenType: TokenType.REFRESH_TOKEN,
                },
                {
                    secret: this.refreshTokenSecret,
                    expiresIn: expiresIn ?? Number(this.refreshTokenExp),
                }
            ),
        ]);

        const hashedRefreshToken =
            await this.hashService.createHashAsync(refreshToken);
        await this.userAuthService.saveRefreshToken(
            user.id,
            hashedRefreshToken
        );

        return { accessToken, refreshToken };
    }

    async refreshTokens(
        user: IAuthPayload,
        clientRefreshToken: string
    ): Promise<ITokenResponse> {
        const hashedToken = await this.userAuthService.getRefreshToken(user.id);

        if (!hashedToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        const isValid = await this.hashService.matchAsync(
            hashedToken,
            clientRefreshToken
        );

        if (!isValid) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return this.generateTokens(user);
    }
}
