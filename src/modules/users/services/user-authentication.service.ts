import { Injectable } from '@nestjs/common';
import { UserAuthenticationRepository } from '../repositories/user-authentication.repository';

@Injectable()
export class UserAuthenticationService {
    constructor(private readonly userAuthRepo: UserAuthenticationRepository) {}

    async saveRefreshToken(userId: string, hashedToken: string): Promise<void> {
        await this.userAuthRepo.saveRefreshToken(userId, hashedToken);
    }

    async getRefreshToken(userId: string): Promise<string | null> {
        return this.userAuthRepo.getRefreshToken(userId);
    }

    async deleteRefreshToken(userId: string): Promise<void> {
        await this.userAuthRepo.deleteRefreshToken(userId);
    }
}
