import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto, UserResponseDto } from '../dtos';
import { IUserRepository } from '../interfaces/user.repository';

@Injectable()
export class UserService {
    constructor(
        @Inject('IUserRepository') private readonly users: IUserRepository
    ) {}

    async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
        const userFound = await this.users.findByEmail(dto.email);
        if (userFound) {
            throw new ConflictException('User already exists with this email');
        }

        const user = await this.users.create({
            email: dto.email,
            password: dto.password,
        });

        return plainToInstance(UserResponseDto, user);
    }

    async findAllUsers(): Promise<UserResponseDto[]> {
        const users = await this.users.findAll();
        return plainToInstance(UserResponseDto, users);
    }

    async findUserById(id: string): Promise<UserResponseDto | null> {
        const user = await this.users.findById(id);
        if (!user) return null;

        return plainToInstance(UserResponseDto, user);
    }

    async findUserByEmail(email: string): Promise<User | null> {
        const user = await this.users.findByEmail(email);
        return user;
    }
}
