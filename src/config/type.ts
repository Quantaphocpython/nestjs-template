export type AppConfig = {
    env: {
        type: 'production' | 'development';
    };
    api: {
        port: number;
        path: string;
        url: string;
    };
    db: {
        url: string;
        // redisUrl: string;
    };
    hash: {
        saltRounds?: number;
    };
    auth: {
        accessToken: {
            secret: string;
            expiresIn: string;
        };
        refreshToken: {
            secret: string;
            expiresIn: string;
        };
    };
    // };
    // next: {
    //   authSecret?: string;
    // };
    // app: {
    //   baseUrl?: string;
    // };
};
