import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { CreateUserDto, UserResponseDto } from '../dtos';
import { IUserRepository } from '../interfaces/user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;
    let userRepository: jest.Mocked<IUserRepository>;

    const mockUser: User = {
        id: 'user-id-123',
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed-password',
        emailVerified: true,
        image: 'avatar.jpg',
        isDeleted: false,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: null,
        updatedBy: null,
        role: 'User' as any,
        address: null,
        avatarId: null,
        birthday: null,
        isBlocked: false,
        logoId: null,
        phone: null,
        kyc_levels: [],
        is_referral_bonus_paid: false,
        is_referral_campaign_paid: false,
        referral_code: null,
        referrer_code: null,
    };

    const mockUserResponse: UserResponseDto = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        image: mockUser.image,
        role: mockUser.role,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
    } as any;

    beforeEach(async () => {
        const mockUserRepository: Partial<IUserRepository> = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: 'IUserRepository',
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        userRepository = module.get('IUserRepository');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createUser', () => {
        const createUserDto: CreateUserDto = {
            email: 'newuser@example.com',
            password: 'password123',
            name: 'New User',
        };

        it('should successfully create a new user', async () => {
            userRepository.findByEmail.mockResolvedValue(null);
            userRepository.create.mockResolvedValue(mockUser);

            const result = await service.createUser(createUserDto);

            expect(userRepository.findByEmail).toHaveBeenCalledWith(
                createUserDto.email
            );
            expect(userRepository.create).toHaveBeenCalledWith({
                email: createUserDto.email,
                password: createUserDto.password,
            });
            expect(result).toBeInstanceOf(UserResponseDto);
            expect(result.id).toEqual(mockUser.id);
            expect(result.email).toEqual(mockUser.email);
            expect((result as any).password).toBeUndefined(); // password should be excluded
        });

        it('should throw ConflictException when user already exists', async () => {
            userRepository.findByEmail.mockResolvedValue(mockUser);

            await expect(service.createUser(createUserDto)).rejects.toThrow(
                new ConflictException('User already exists with this email')
            );
            expect(userRepository.create).not.toHaveBeenCalled();
        });

        it('should call repository create with only email and password', async () => {
            const dtoWithExtraFields: CreateUserDto = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test',
                phone: '1234567890',
                address: '123 Street',
            };

            userRepository.findByEmail.mockResolvedValue(null);
            userRepository.create.mockResolvedValue(mockUser);

            await service.createUser(dtoWithExtraFields);

            expect(userRepository.create).toHaveBeenCalledWith({
                email: dtoWithExtraFields.email,
                password: dtoWithExtraFields.password,
            });
        });
    });

    describe('findAllUsers', () => {
        it('should return an array of users', async () => {
            const mockUsers = [mockUser];
            userRepository.findAll.mockResolvedValue(mockUsers as any);

            const result = await service.findAllUsers();

            expect(userRepository.findAll).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0]).toBeInstanceOf(UserResponseDto);
            expect(result[0].id).toEqual(mockUser.id);
            expect((result[0] as any).password).toBeUndefined();
        });

        it('should return an empty array when no users exist', async () => {
            userRepository.findAll.mockResolvedValue([]);

            const result = await service.findAllUsers();

            expect(result).toEqual([]);
            expect(result).toHaveLength(0);
        });
    });

    describe('findUserById', () => {
        it('should return a user when found', async () => {
            const userId = 'user-id-123';
            userRepository.findById.mockResolvedValue(mockUser as any);

            const result = await service.findUserById(userId);

            expect(userRepository.findById).toHaveBeenCalledWith(userId);
            expect(result).toBeInstanceOf(UserResponseDto);
            expect(result?.id).toEqual(mockUser.id);
            expect((result as any)?.password).toBeUndefined();
        });

        it('should return null when user not found', async () => {
            const userId = 'non-existent-id';
            userRepository.findById.mockResolvedValue(null);

            const result = await service.findUserById(userId);

            expect(userRepository.findById).toHaveBeenCalledWith(userId);
            expect(result).toBeNull();
        });
    });

    describe('findUserByEmail', () => {
        it('should return a user when found', async () => {
            const email = 'test@example.com';
            userRepository.findByEmail.mockResolvedValue(mockUser);

            const result = await service.findUserByEmail(email);

            expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(result).toEqual(mockUser);
        });

        it('should return null when user not found', async () => {
            const email = 'nonexistent@example.com';
            userRepository.findByEmail.mockResolvedValue(null);

            const result = await service.findUserByEmail(email);

            expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(result).toBeNull();
        });

        it('should handle email with different cases', async () => {
            const email = 'Test@Example.COM';
            userRepository.findByEmail.mockResolvedValue(mockUser);

            const result = await service.findUserByEmail(email);

            expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
            expect(result).toEqual(mockUser);
        });
    });
});
