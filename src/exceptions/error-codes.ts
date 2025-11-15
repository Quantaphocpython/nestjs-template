export enum ErrorCode {
    // Auth module (100s)
    UNAUTHORIZED = 101,
    INVALID_CREDENTIALS = 102,

    // Users module (200s)
    USER_NOT_FOUND = 200,
    USER_ALREADY_EXISTS = 201,

    // Validation / Generic
    VALIDATION_ERROR = 400,

    // Internal
    INTERNAL_SERVER_ERROR = 500,
}
import { StatusCodes } from 'src/lib/enums/status-code';

export type ErrorMeta = {
    statusCode: StatusCodes;
    message: string;
};

export const ErrorMap: Record<ErrorCode, ErrorMeta> = {
    [ErrorCode.UNAUTHORIZED]: {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Unauthorized',
    },
    [ErrorCode.INVALID_CREDENTIALS]: {
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Invalid credentials',
    },
    [ErrorCode.USER_NOT_FOUND]: {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'User not found',
    },
    [ErrorCode.USER_ALREADY_EXISTS]: {
        statusCode: StatusCodes.CONFLICT,
        message: 'User already exists',
    },
    [ErrorCode.VALIDATION_ERROR]: {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Validation failed',
    },
    [ErrorCode.INTERNAL_SERVER_ERROR]: {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
    },
};
