import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
    ApiPaginatedResponseDto,
    ApiResponseDto,
} from 'src/modules/common/dtos/app-response.dto';
import { PaginationMetaDto } from 'src/modules/common/dtos/paginate.dto';

@Injectable()
export class ResponseInterceptor<T>
    implements
        NestInterceptor<
            T | { data: T | T[]; meta?: PaginationMetaDto },
            ApiResponseDto<T> | ApiPaginatedResponseDto<T>
        >
{
    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<ApiResponseDto<T> | ApiPaginatedResponseDto<T>> {
        return next.handle().pipe(
            map((originalData: any) => {
                const statusCode =
                    context.switchToHttp().getResponse().statusCode ?? 200;

                if (
                    originalData?.data &&
                    Array.isArray(originalData.data) &&
                    originalData.meta
                ) {
                    const res = new (class extends ApiPaginatedResponseDto<T> {
                        data = originalData.data;
                        meta = originalData.meta;
                    })();
                    res.statusCode = statusCode;
                    return res;
                }

                const res = new (class extends ApiResponseDto<T> {
                    data = originalData?.data ?? originalData;
                })();
                res.statusCode = statusCode;
                return res;
            })
        );
    }
}
