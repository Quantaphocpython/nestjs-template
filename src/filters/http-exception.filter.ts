import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    Logger,
} from '@nestjs/common';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { ERROR_STATUS } from '../lib/constants';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    private readonly logger = new Logger('HttpExceptionFilter');

    @SentryExceptionCaptured()
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<FastifyReply>();
        const request = ctx.getRequest<FastifyRequest>();
        const statusCode = exception.getStatus();
        const requestId =
            request.headers['x-request-id'] ?? 'unknown-request-id';
        // response.header("X-Request-Id", requestId.toString());
        // const userContext = extractUserContext(request);
        this.logger.error(`Http Exception Filter: ${exception?.message}`, {
            exception,
            body: request.body,
            // headers: filterReqHeaders(request.headers),
            url: request.url,
            method: request.method,
            requestId,
            // ...userContext,
        });

        response.status(statusCode).send({
            status: ERROR_STATUS,
            timestamp: new Date().toISOString(),
            path: request.url,
            error: {
                code: exception.name,
                message: exception.message,
                details: exception.getResponse(),
            },
        });
    }
}
