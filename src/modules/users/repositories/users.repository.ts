import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/modules/common/services/prisma.service';
import { CreateUserDto } from '../dtos';
import { IUserRepository } from '../interfaces/user.repository';

@Injectable()
export class UserPrismaRepository implements IUserRepository {
    constructor(private readonly database: PrismaService) {}

    async create(dto: CreateUserDto): Promise<User> {
        const id = crypto.randomUUID();

        return this.database.user.create({
            data: {
                id,
                name: dto.name,
                email: dto.email,
                password: dto.password,
                emailVerified: true,
                image: '',
                phone: dto.phone,
                address: dto.address,
                birthday: dto.birthday ? new Date(dto.birthday) : null,
                isBlocked: false,
                createdBy: id,
                updatedBy: id,
            },
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.database.user.findUnique({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.database.user.findUnique({
            where: { email },
        });
    }

    async findAll(): Promise<User[]> {
        return this.database.user.findMany({
            where: { deletedAt: null },
        });
    }
}
