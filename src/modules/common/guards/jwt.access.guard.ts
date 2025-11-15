import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { PUBLIC_ROUTE_KEY } from 'src/lib/constants';

@Injectable()
export class AuthJwtAccessGuard extends AuthGuard('jwt-access') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    // Execution order: canActivate -> handleRequest
    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            PUBLIC_ROUTE_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }

    handleRequest<TUser = any>(
        err: Error,
        user: TUser,
        info: Error,
        context: ExecutionContext
    ): TUser {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            PUBLIC_ROUTE_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (isPublic) {
            return user;
        }

        if (err || !user) {
            throw new UnauthorizedException(
                'Access token is invalid or expired'
            );
        }

        // This would attach to the request object as req.user
        return user;
    }
}
