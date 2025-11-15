import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { ROLES_DECORATOR_KEY } from 'src/lib/constants';

// Attach allowed roles to route metadata and mark as bearer-protected in Swagger
export const Roles = (...roles: UserRole[]) =>
    applyDecorators(
        SetMetadata(ROLES_DECORATOR_KEY, roles),
        ApiBearerAuth('JwtAccess')
    );
