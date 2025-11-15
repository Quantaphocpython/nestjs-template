import { Test, TestingModule } from '@nestjs/testing';
import { UserAuthenticationRepository } from '../repositories/user-authentication.repository';
import { UserAuthenticationService } from './user-authentication.service';

describe('UserAuthenticationService', () => {
    let service: UserAuthenticationService;
    let repository: jest.Mocked<UserAuthenticationRepository>;

    const mockUserId = 'user-id-123';
    const mockHashedToken = 'hashed-refresh-token-abc123';

    beforeEach(async () => {
        const mockRepository: Partial<UserAuthenticationRepository> = {
            saveRefreshToken: jest.fn(),
            getRefreshToken: jest.fn(),
            deleteRefreshToken: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserAuthenticationService,
                {
                    provide: UserAuthenticationRepository,
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<UserAuthenticationService>(
            UserAuthenticationService
        );
        repository = module.get(UserAuthenticationRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('saveRefreshToken', () => {
        it('should save refresh token successfully', async () => {
            repository.saveRefreshToken.mockResolvedValue(undefined);

            await service.saveRefreshToken(mockUserId, mockHashedToken);

            expect(repository.saveRefreshToken).toHaveBeenCalledWith(
                mockUserId,
                mockHashedToken
            );
            expect(repository.saveRefreshToken).toHaveBeenCalledTimes(1);
        });

        it('should handle repository errors when saving token', async () => {
            const error = new Error('Database error');
            repository.saveRefreshToken.mockRejectedValue(error);

            await expect(
                service.saveRefreshToken(mockUserId, mockHashedToken)
            ).rejects.toThrow(error);
            expect(repository.saveRefreshToken).toHaveBeenCalledWith(
                mockUserId,
                mockHashedToken
            );
        });

        it('should save different tokens for the same user', async () => {
            const firstToken = 'first-token';
            const secondToken = 'second-token';
            repository.saveRefreshToken.mockResolvedValue(undefined);

            await service.saveRefreshToken(mockUserId, firstToken);
            await service.saveRefreshToken(mockUserId, secondToken);

            expect(repository.saveRefreshToken).toHaveBeenCalledTimes(2);
            expect(repository.saveRefreshToken).toHaveBeenNthCalledWith(
                1,
                mockUserId,
                firstToken
            );
            expect(repository.saveRefreshToken).toHaveBeenNthCalledWith(
                2,
                mockUserId,
                secondToken
            );
        });
    });

    describe('getRefreshToken', () => {
        it('should return refresh token when found', async () => {
            repository.getRefreshToken.mockResolvedValue(mockHashedToken);

            const result = await service.getRefreshToken(mockUserId);

            expect(repository.getRefreshToken).toHaveBeenCalledWith(mockUserId);
            expect(result).toBe(mockHashedToken);
        });

        it('should return null when refresh token not found', async () => {
            repository.getRefreshToken.mockResolvedValue(null);

            const result = await service.getRefreshToken(mockUserId);

            expect(repository.getRefreshToken).toHaveBeenCalledWith(mockUserId);
            expect(result).toBeNull();
        });

        it('should handle repository errors when getting token', async () => {
            const error = new Error('Database connection failed');
            repository.getRefreshToken.mockRejectedValue(error);

            await expect(service.getRefreshToken(mockUserId)).rejects.toThrow(
                error
            );
            expect(repository.getRefreshToken).toHaveBeenCalledWith(mockUserId);
        });

        it('should retrieve tokens for different users', async () => {
            const userId1 = 'user-1';
            const userId2 = 'user-2';
            const token1 = 'token-1';
            const token2 = 'token-2';

            repository.getRefreshToken
                .mockResolvedValueOnce(token1)
                .mockResolvedValueOnce(token2);

            const result1 = await service.getRefreshToken(userId1);
            const result2 = await service.getRefreshToken(userId2);

            expect(result1).toBe(token1);
            expect(result2).toBe(token2);
            expect(repository.getRefreshToken).toHaveBeenCalledTimes(2);
        });
    });

    describe('deleteRefreshToken', () => {
        it('should delete refresh token successfully', async () => {
            repository.deleteRefreshToken.mockResolvedValue(undefined);

            await service.deleteRefreshToken(mockUserId);

            expect(repository.deleteRefreshToken).toHaveBeenCalledWith(
                mockUserId
            );
            expect(repository.deleteRefreshToken).toHaveBeenCalledTimes(1);
        });

        it('should handle repository errors when deleting token', async () => {
            const error = new Error('Failed to delete token');
            repository.deleteRefreshToken.mockRejectedValue(error);

            await expect(
                service.deleteRefreshToken(mockUserId)
            ).rejects.toThrow(error);
            expect(repository.deleteRefreshToken).toHaveBeenCalledWith(
                mockUserId
            );
        });

        it('should delete tokens for multiple users', async () => {
            const userId1 = 'user-1';
            const userId2 = 'user-2';
            repository.deleteRefreshToken.mockResolvedValue(undefined);

            await service.deleteRefreshToken(userId1);
            await service.deleteRefreshToken(userId2);

            expect(repository.deleteRefreshToken).toHaveBeenCalledTimes(2);
            expect(repository.deleteRefreshToken).toHaveBeenNthCalledWith(
                1,
                userId1
            );
            expect(repository.deleteRefreshToken).toHaveBeenNthCalledWith(
                2,
                userId2
            );
        });

        it('should successfully delete even if token does not exist', async () => {
            repository.deleteRefreshToken.mockResolvedValue(undefined);

            await service.deleteRefreshToken('non-existent-user');

            expect(repository.deleteRefreshToken).toHaveBeenCalledWith(
                'non-existent-user'
            );
        });
    });

    describe('integration scenarios', () => {
        it('should handle complete token lifecycle', async () => {
            repository.saveRefreshToken.mockResolvedValue(undefined);
            repository.getRefreshToken.mockResolvedValue(mockHashedToken);
            repository.deleteRefreshToken.mockResolvedValue(undefined);

            // Save token
            await service.saveRefreshToken(mockUserId, mockHashedToken);
            expect(repository.saveRefreshToken).toHaveBeenCalledWith(
                mockUserId,
                mockHashedToken
            );

            // Get token
            const token = await service.getRefreshToken(mockUserId);
            expect(token).toBe(mockHashedToken);

            // Delete token
            await service.deleteRefreshToken(mockUserId);
            expect(repository.deleteRefreshToken).toHaveBeenCalledWith(
                mockUserId
            );
        });

        it('should handle token not found after deletion', async () => {
            repository.deleteRefreshToken.mockResolvedValue(undefined);
            repository.getRefreshToken.mockResolvedValue(null);

            await service.deleteRefreshToken(mockUserId);
            const token = await service.getRefreshToken(mockUserId);

            expect(token).toBeNull();
        });
    });
});
