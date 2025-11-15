export interface ITokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface IAuthPayload {
    id: string;
    role: string;
    tokenType?: TokenType;
    image?: string;
}

export enum TokenType {
    ACCESS_TOKEN = 'AccessToken',
    REFRESH_TOKEN = 'RefreshToken',
}
