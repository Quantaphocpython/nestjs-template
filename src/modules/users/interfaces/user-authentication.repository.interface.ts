export interface IUserAuthenticationRepository {
    saveRefreshToken(userId: string, hashedToken: string): Promise<void>;
    getRefreshToken(userId: string): Promise<string | null>;
    deleteRefreshToken(userId: string): Promise<void>;
}
