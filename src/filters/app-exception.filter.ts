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

/**
 * Interface cho kết quả xử lý lỗi nội bộ
 */
interface IErrorResponse {
    payload: ApiResponseDto<null>;
    status: number;
}

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
    /**
     * Phương thức CATCH chính
     * Vai trò: Chỉ điều phối, lấy context và gửi response.
     */
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response: any = ctx.getResponse();
        // const request: any = ctx.getRequest(); // Vẫn lấy được nếu cần log

        // 1. Ủy quyền việc xây dựng payload và status cho helper
        const { payload, status } = this.buildErrorResponse(exception);

        // 2. Gửi response
        this.sendResponse(response, status, payload);
    }

    // -------------------------------------------------------------------
    // CÁC HELPER METHOD (PRIVATE)
    // -------------------------------------------------------------------

    /**
     * "Bộ định tuyến" lỗi, quyết định hàm build nào sẽ được gọi.
     */
    private buildErrorResponse(exception: unknown): IErrorResponse {
        if (exception instanceof AppException) {
            return this.buildAppExceptionResponse(exception);
        }

        if (exception instanceof HttpException) {
            return this.buildHttpExceptionResponse(exception);
        }

        // Mặc định là lỗi 500 (instanceof Error hoặc unknown)
        return this.buildUnknownErrorResponse(exception);
    }

    /**
     * Xử lý lỗi 1: Custom AppException
     */
    private buildAppExceptionResponse(exception: AppException): IErrorResponse {
        const status = exception.getStatus();
        const resp = exception.getResponse() as any;

        const code = resp?.code ?? ErrorCode.INTERNAL_SERVER_ERROR;
        const message =
            resp?.message ?? ErrorMap[ErrorCode.INTERNAL_SERVER_ERROR].message;
        const errors = resp?.details ?? null;

        const payload: ApiResponseDto<null> = {
            code,
            statusCode: status,
            message,
            errors,
            data: null,
        };
        return { payload, status };
    }

    /**
     * Xử lý lỗi 2: HttpException (chung hoặc Validation)
     */
    private buildHttpExceptionResponse(
        exception: HttpException
    ): IErrorResponse {
        const status = exception.getStatus();
        const resp = exception.getResponse();

        // Trường hợp đặc biệt: Lỗi Validation từ class-validator
        if (this.isValidationError(status, resp)) {
            return this.buildValidationResponse(resp as any);
        }

        // Các lỗi HttpException khác (404, 403, 401...)
        let message: string;
        let errors: any = null;

        if (typeof resp === 'string') {
            message = resp;
        } else {
            message =
                (resp as any)?.message ||
                (resp as any)?.error ||
                ErrorMap[ErrorCode.INTERNAL_SERVER_ERROR].message;
            // Nếu message lấy được không phải là message trong resp,
            // thì có thể toàn bộ resp là object lỗi
            if (message !== (resp as any)?.message) {
                errors = resp;
            }
        }

        const payload: ApiResponseDto<null> = {
            code: ErrorCode.INTERNAL_SERVER_ERROR, // Lỗi HTTP thường không có code riêng
            statusCode: status,
            message,
            errors,
            data: null,
        };
        return { payload, status };
    }

    /**
     * Xử lý lỗi 3: Lỗi 500 chung (Unknown/Error)
     */
    private buildUnknownErrorResponse(exception: unknown): IErrorResponse {
        const status = StatusCodes.INTERNAL_SERVER_ERROR;
        const code = ErrorCode.INTERNAL_SERVER_ERROR;

        let errorDetails: any = null;
        if (exception instanceof Error) {
            // Thêm stack trace nếu là môi trường dev (tùy chọn)
            errorDetails = {
                message: exception.message,
                stack: exception.stack,
            };
        }

        const payload: ApiResponseDto<null> = {
            code,
            statusCode: status,
            message: ErrorMap[code].message,
            errors: errorDetails,
            data: null,
        };
        return { payload, status };
    }

    /**
     * Helper kiểm tra xem đây có phải là lỗi Validation không
     */
    private isValidationError(status: number, resp: string | object): boolean {
        const validationMessages =
            (resp as any)?.message || (resp as any)?.errors;
        return (
            status === StatusCodes.BAD_REQUEST &&
            Array.isArray(validationMessages) &&
            validationMessages.length > 0 &&
            validationMessages.every((v: any) => v.constraints)
        );
    }

    /**
     * Helper chỉ để build lỗi Validation (tách ra từ buildHttpExceptionResponse)
     */
    private buildValidationResponse(resp: any): IErrorResponse {
        const status = StatusCodes.BAD_REQUEST;
        const validationMessages = resp?.message || resp?.errors;

        const errors = validationMessages.map((v: any) => ({
            field: v.property,
            constraints: v.constraints,
        }));

        const payload: ApiResponseDto<null> = {
            code: ErrorCode.VALIDATION_ERROR,
            statusCode: status,
            message: ErrorMap[ErrorCode.VALIDATION_ERROR].message,
            errors,
            data: null,
        };
        return { payload, status };
    }

    /**
     * Helper để gửi response (Hỗ trợ cả Express và Fastify)
     */
    private sendResponse(
        response: any,
        status: number,
        payload: ApiResponseDto<null>
    ) {
        if (response?.send) {
            // Dùng cho Fastify
            response.status(status).send(payload);
        } else if (response?.json) {
            // Dùng cho Express
            response.status(status).json(payload);
        } else {
            // Fallback
            try {
                response.statusCode = status;
                response.end(JSON.stringify(payload));
            } catch {}
        }
    }
}
