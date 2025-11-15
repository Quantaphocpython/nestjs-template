import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common/services/prisma.service';
import { IUserAuthenticationRepository } from '../interfaces/user-authentication.repository.interface';

@Injectable()
export class UserAuthenticationRepository
    implements IUserAuthenticationRepository
{
    constructor(private readonly prisma: PrismaService) {}

    async saveRefreshToken(userId: string, hashedToken: string): Promise<void> {
        await this.prisma.userAuthentication.upsert({
            where: { userId },
            create: {
                userId,
                type: 'credentials',
                provider: 'local',
                providerAccountId: userId,
                refresh_token: hashedToken,
            },
            update: {
                refresh_token: hashedToken,
                updatedAt: new Date(),
            },
        });
    }

    async getRefreshToken(userId: string): Promise<string | null> {
        const auth = await this.prisma.userAuthentication.findUnique({
            where: { userId },
            select: { refresh_token: true },
        });

        return auth?.refresh_token ?? null;
    }

    async deleteRefreshToken(userId: string): Promise<void> {
        await this.prisma.userAuthentication.updateMany({
            where: { userId },
            data: {
                refresh_token: null,
                updatedAt: new Date(),
            },
        });
    }
}
