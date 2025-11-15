import './instrument';

import type { ValidationError } from '@nestjs/common';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ResponseInterceptor } from './filters/global-response.filter';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AppExceptionFilter } from './filters/app-exception.filter';
import { PrismaExceptionFilter } from './filters/prisma-exception.filter';
import { Prefix } from './lib/constants';

export const bootstrap = (
    app: NestFastifyApplication
): NestFastifyApplication => {
    // Enable shutdown hooks - graceful shutdown
    app.enableShutdownHooks(); // often used to implement event OnApplicationShutdown

    // Collections  of middleware protecting the app from common web vulnerabilities
    app.use(helmet());

    // API Global Prefix
    app.setGlobalPrefix(Prefix.GLOBAL, {
        exclude: ['/docs'],
    });
    app.enableCors({
        origin: '*',
        methods: ['GET', 'PATCH', 'DELETE', 'HEAD', 'POST', 'PUT', 'OPTIONS'],
        allowedHeaders: ['Accept', 'Authorization', 'Content-Type', 'Origin'],
        maxAge: 86_400, // 24 hours - preflight cache duration
    });

    // Global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // Strip unknown properties
            transform: true, // Transform payloads to DTO objects based on class-transformer options
            validationError: {
                target: true, // Include the validation error target in the response
                value: true, // Include the validation error value in the response
            },
            // Custom exception factory for validation errors
            exceptionFactory(errors: ValidationError[]) {
                // When validation fails, return a BadRequestException with the validation errors
                return new BadRequestException({ errors });
            },
        })
    );

    // Exception filters for different types of errors
    app.useGlobalFilters(new PrismaExceptionFilter());
    // Use our unified AppExceptionFilter to normalize all exceptions (validation, AppException, generic)
    app.useGlobalFilters(new AppExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

    // Cookie parser middleware
    app.use(cookieParser());

    if (process?.env?.API_GLOBAL_PREFIX) {
        app.setGlobalPrefix(process?.env?.API_GLOBAL_PREFIX);
    }

    return app;
};
