import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthPublicController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

@Module({
    imports: [
        ConfigModule,
        UsersModule,
        // session false is used to prevent session-based authentication
        PassportModule.register({ defaultStrategy: 'jwt', session: false }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
                },
            }),
        }),
    ],
    controllers: [AuthPublicController],
    providers: [AuthService],
})
export class AuthModule {}
