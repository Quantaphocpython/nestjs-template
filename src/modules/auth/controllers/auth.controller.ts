import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { PublicRoute } from 'src/modules/common/decorators/public.decorator';
import { SwaggerResponse } from 'src/modules/common/dtos/app-response.dto';
import { AuthJwtAccessGuard } from 'src/modules/common/guards/jwt.access.guard';
import { AuthJwtRefreshGuard } from 'src/modules/common/guards/jwt.refresh.guard';
import { AuthUser } from '../decorators/auth-user.decorator';
import { BearerToken } from '../decorators/bearer-token.decorator';
import {
    AuthRefreshResponseDto,
    AuthResponseDto,
} from '../dtos/auth.response.dto';
import { AuthSignInDto } from '../dtos/auth.sign-in.dto';
import { AuthSignUpDto } from '../dtos/auth.sign-up.dto';
import { IAuthPayload } from '../interfaces/auth.interface';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthPublicController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        description: 'Authenticate user with email and password',
    })
    @ApiResponse({
        description: 'User successfully authenticated',
        type: SwaggerResponse(AuthResponseDto),
    })
    @Post('sign-in')
    @HttpCode(200)
    @PublicRoute('Sign in user with email and password')
    async signIn(@Body() signInDto: AuthSignInDto) {
        return this.authService.signIn(signInDto);
    }

    @ApiOperation({
        description: 'Create a new user account',
    })
    @ApiResponse({
        status: 201,
        description: 'User successfully created',
    })
    @Post('sign-up')
    @PublicRoute('Signup new user')
    async signUp(@Body() signUpDto: AuthSignUpDto) {
        return this.authService.signUp(signUpDto);
    }

    @Post('sign-out')
    @HttpCode(200)
    @UseGuards(AuthJwtAccessGuard)
    @ApiOperation({
        description: 'Sign out and delete refresh token',
    })
    async signOut(@AuthUser() user: IAuthPayload) {
        return this.authService.signOut(user.id);
    }

    @UseGuards(AuthJwtRefreshGuard)
    @Post('refresh')
    @PublicRoute()
    @HttpCode(200)
    @ApiBearerAuth('JwtRefresh')
    @ApiOperation({
        description:
            'Generate new access and refresh tokens using refresh token',
    })
    @ApiResponse({
        status: 200,
        description: 'Tokens successfully refreshed',
        type: SwaggerResponse(AuthRefreshResponseDto),
    })
    refreshTokens(
        @AuthUser() user: IAuthPayload,
        @BearerToken() refreshToken: string
    ): Promise<AuthRefreshResponseDto> {
        return this.authService.refreshTokens(user, refreshToken);
    }
}
