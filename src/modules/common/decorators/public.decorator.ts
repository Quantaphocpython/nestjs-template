import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { PUBLIC_ROUTE_KEY } from 'src/lib/constants';

/**
 * Decorator to mark a route as public.
 * @param description - The description of the route.
 * @returns A decorator function.
 */
export const PublicRoute = (description?: string) => {
    const decorators: Array<
        ClassDecorator | MethodDecorator | PropertyDecorator
    > = [SetMetadata(PUBLIC_ROUTE_KEY, true)];

    if (description) {
        decorators.push(
            ApiOperation({
                summary: description,
                security: [],
            })
        );
    }

    return applyDecorators(...decorators);
};
