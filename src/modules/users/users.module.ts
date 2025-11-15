import { Module } from '@nestjs/common';

import { UserController } from './controllers/user.controller';
import { UserAuthenticationRepository } from './repositories/user-authentication.repository';
import { UserPrismaRepository } from './repositories/users.repository';
import { UserAuthenticationService } from './services/user-authentication.service';
import { UserService } from './services/user.service';

@Module({
    controllers: [UserController],
    providers: [
        {
            provide: 'IUserRepository',
            useClass: UserPrismaRepository,
        },
        UserService,
        UserAuthenticationRepository,
        UserAuthenticationService,
    ],
    exports: [UserService, UserAuthenticationService],
})
export class UsersModule {}
