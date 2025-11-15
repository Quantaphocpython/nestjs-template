export const ERROR_STATUS = 'error';
export const PUBLIC_ROUTE_KEY = 'isPublic';
export const ROLES_DECORATOR_KEY = 'roles';
export const FEATURE_FLAG_DECORATOR_KEY = 'featureFlagKey';

export const Prefix = {
    USER: 'user',
    ADMIN: 'admin',
    GLOBAL: 'api',
};

export const NON_REMEMBER_EXPIRATION = 1800; // 30 minutes
export const REMEMBER_ME_EXPIRATION = 60 * 60 * 24; // 1 day

// Export regex patterns
export * from './regex';
