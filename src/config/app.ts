import { getEnv } from '../env';

import type { AppConfig } from './type';

export const appConfig = (): AppConfig => {
    return {
        env: {
            type: getEnv('NODE_ENV', 'development'),
        },
        api: {
            port: Number(getEnv('API_PORT', '5555')),
            path: getEnv('API_URL', 'http://localhost'),
            url: `${getEnv('API_URL', 'http://localhost')}${
                process.env.API_PORT &&
                getEnv('NODE_ENV', 'development') === 'development'
                    ? `:${Number(getEnv('API_PORT', '5555'))}`
                    : ''
            }/v2`,
        },
        db: {
            url: getEnv('DATABASE_URL'),
            // redisUrl: getEnv("REDIS_URL"),
        },
        auth: {
            accessToken: {
                secret: getEnv('JWT_SECRET'),
                expiresIn: `${getEnv('JWT_EXPIRATION_TIME', 3600)}`,
            },
            refreshToken: {
                secret: getEnv('JWT_REFRESH_SECRET'),
                expiresIn: `${getEnv('JWT_REFRESH_EXPIRATION_TIME', 604800)}`,
            },
        },
        hash: {
            saltRounds: Number(getEnv('HASH_SALT_ROUNDS', 12)),
        },

        // next: {
        //   authSecret: getEnv("NEXTAUTH_SECRET"),
        // },
        // app: {
        //   baseUrl: getEnv("WEB_APP_URL", "https://app.cal.com"),
        // },
    };
};
