import { User } from '@prisma/client';
import { CreateUserDto } from '../dtos';

export interface IUserRepository {
    create(dto: CreateUserDto): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
}
