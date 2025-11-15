import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { AppException } from '../exceptions/app-exception';
import { ErrorCode, ErrorMap } from '../exceptions/error-codes';
import { ApiResponseDto } from 'src/modules/common/dtos/app-response.dto';
import { StatusCodes } from 'src/lib/enums/status-code';

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response: any = ctx.getResponse();
        const request: any = ctx.getRequest();

        let code = ErrorCode.INTERNAL_SERVER_ERROR;
        let status = StatusCodes.INTERNAL_SERVER_ERROR;
        let message = ErrorMap[ErrorCode.INTERNAL_SERVER_ERROR].message;
        let errors: any = null;

        // 1. Custom AppException
        if (exception instanceof AppException) {
            const resp = exception.getResponse() as any;
            status = exception.getStatus();
            code = resp?.code ?? code;
            message = resp?.message ?? message;
            errors = resp?.details ?? null;

            // 2. HttpException (validation or other)
        } else if (exception instanceof HttpException) {
            status = exception.getStatus();
            const resp = exception.getResponse();

            const validationMessages =
                (resp as any)?.message || (resp as any)?.errors;

            if (
                status === StatusCodes.BAD_REQUEST &&
                Array.isArray(validationMessages) &&
                validationMessages.length > 0 &&
                validationMessages.every((v: any) => v.constraints)
            ) {
                code = ErrorCode.VALIDATION_ERROR;
                message = ErrorMap[ErrorCode.VALIDATION_ERROR].message;

                errors = validationMessages.map((v: any) => ({
                    field: v.property,
                    constraints: v.constraints,
                }));
            } else {
                if (typeof resp === 'string') {
                    message = resp;
                } else {
                    message =
                        (resp as any)?.message ||
                        (resp as any)?.error ||
                        message;
                    if (message !== (resp as any)?.message) {
                        errors = resp;
                    }
                }
            }
        } else if (exception instanceof Error) {
            // 3. Lỗi 500 chung
            status = StatusCodes.INTERNAL_SERVER_ERROR;
            code = ErrorCode.INTERNAL_SERVER_ERROR;
            message = ErrorMap[ErrorCode.INTERNAL_SERVER_ERROR].message;
            errors = { message: exception.message, stack: exception.stack };
        }

        // Build payload
        const payload: ApiResponseDto<null> = {
            code,
            statusCode: status,
            message,
            errors,
            data: null,
        };

        // Send response (Fastify or Express)
        if (response?.send) {
            response.status(status).send(payload);
        } else if (response?.json) {
            response.status(status).json(payload);
        } else {
            try {
                response.statusCode = status;
                response.end(JSON.stringify(payload));
            } catch {}
        }
    }
}
