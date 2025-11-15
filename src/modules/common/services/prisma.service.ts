import {
    Injectable,
    Logger,
    OnModuleDestroy,
    OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy
{
    private logger = new Logger('PrismaService');

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Connected to read database');
        } catch (error) {
            this.logger.error('Database connection failed', error);
        }
    }

    async onModuleDestroy() {
        try {
            await this.$disconnect();
        } catch (error) {
            this.logger.error('Error disconnecting from read database', error);
        }
    }

    async isHealthy() {
        try {
            await this.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            this.logger.error('Database is not healthy', error);
            return false;
        }
    }
}
