import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PublicRoute } from './modules/common/decorators/public.decorator';
import { PrismaService } from './modules/common/services/prisma.service';

@ApiTags('App')
@Controller()
export class AppController {
    constructor(private readonly prismaService: PrismaService) {}

    @PublicRoute('Get health of the application')
    @Get('/health')
    public async getHealth() {
        const isHealthy = await this.prismaService.isHealthy();

        return {
            status: isHealthy,
        };
    }

    @Get('/admin/test')
    public getAdminTest(): { ok: boolean } {
        return { ok: true };
    }
}
