import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SentryModule } from '@sentry/nestjs/setup';
import { AppExceptionFilter } from './filters/app-exception.filter';
import { AppController } from './app.controller';
import { appConfig } from './config/app';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from './modules/common/common.module';
import { UsersModule } from './modules/users/users.module';

@Module({
    imports: [
        SentryModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig],
            expandVariables: true,
            cache: true,
        }),
        EventEmitterModule.forRoot({
            wildcard: false,
            delimiter: '.',
            newListener: false,
            removeListener: false,
            maxListeners: 10,
            verboseMemoryLeak: false,
            ignoreErrors: false,
        }),
        CommonModule,
        AuthModule,
        UsersModule,
    ].filter(Boolean),
    providers: [
        {
            provide: APP_FILTER,
            useClass: AppExceptionFilter,
        },
    ],
    controllers: [AppController],
})
export class AppModule {}
