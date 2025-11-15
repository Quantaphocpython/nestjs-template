// import KeyvRedis from '@keyv/redis'; // Redis disabled (keep for future re-enable)
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { getEnv } from 'src/env';
// import { RedisModule } from '../redis'; // RedisModule removed; restore when Redis is needed
import { AuthJwtAccessGuard } from './guards/jwt.access.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthJwtAccessStrategy } from './providers/jwt.access.strategy';
import { AuthJwtRefreshStrategy } from './providers/jwt.refresh.strategy';
import { HashService } from './services/hash.service';
import { PrismaService } from './services/prisma.service';
import { QueryBuilderService } from './services/query-builder.service';

@Global()
@Module({
    imports: [
        CacheModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (_configService: ConfigService) => {
                // Redis fully disabled: return empty config to use default in-memory cache
                return {};
            },
            isGlobal: true,
        }),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: Number(getEnv('RATE_LIMIT_DEFAULT_TTL_MS')),
                    limit: Number(getEnv('RATE_LIMIT_DEFAULT_LIMIT')),
                },
            ],
        }),
        PassportModule.register({
            defaultStrategy: 'jwt',
            session: false,
        }),
        // RedisModule removed; add back here when enabling Redis
    ],
    providers: [
        PrismaService,
        HashService,
        QueryBuilderService,
        AuthJwtAccessStrategy,
        AuthJwtRefreshStrategy,
        {
            provide: APP_GUARD, // Global guard for JWT access
            useClass: AuthJwtAccessGuard,
        },
        {
            provide: APP_GUARD, // Global guard for roles
            useClass: RolesGuard,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
    exports: [
        PrismaService,
        HashService,
        QueryBuilderService,
        AuthJwtAccessStrategy,
        AuthJwtRefreshStrategy,
        // RedisModule excluded from exports while disabled
    ],
})
export class CommonModule {}
