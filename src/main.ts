import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
import { bootstrap } from './app';
import { AppModule } from './app.module';
import { AppConfig } from './config/type';

run().catch((error: Error) => {
    console.error('Failed to start W-W API', {
        error: error.stack,
    });
    process.exit(1);
});

async function run() {
    const app = await createNestApp();
    const logger = new Logger('App');

    try {
        bootstrap(app);
        const port = app
            .get(ConfigService<AppConfig, true>)
            .get('api.port', { infer: true });

        const config = new DocumentBuilder()
            .setTitle('W-W API')
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    in: 'header',
                    name: 'Authorization',
                    description:
                        'JWT Bearer for access with format "Bearer [token]"',
                },
                'JwtAccess'
            )
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    in: 'header',
                    name: 'Authorization',
                    description:
                        'JWT Bearer for refresh with format "Bearer [token]"',
                },
                'JwtRefresh'
            )
            .build();

        const document = SwaggerModule.createDocument(app, config);

        // Set JwtAccess as default security for all endpoints
        document.security = [{ JwtAccess: [] }];

        if (!process.env.DOCS_URL) {
            SwaggerModule.setup('docs', app, document, {
                customCss: '.swagger-ui .topbar { display: none }',
                swaggerOptions: {
                    persistAuthorization: true,
                },
            });

            logger.log(
                `Swagger documentation available in the "/docs" endpoint\n`
            );
        } else {
            SwaggerModule.setup('docs', app, document, {
                swaggerOptions: {
                    persistAuthorization: true,
                },
            });
            logger.log(
                `Swagger documentation available in the "/docs" endpoint\n`
            );
        }

        await app.listen(port);
        logger.log(`Application started on port: ${port}`);
    } catch (error) {
        console.error(error);
        logger.error('Application crashed', {
            error,
        });
    }
}

export async function createNestApp(): Promise<NestFastifyApplication> {
    return NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            logger: false,
        })
    );
}
