import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/modules/common/decorators/roles.decorator';
import { UserResponseDto } from '../dtos';
import { UserService } from '../services/user.service';

@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    @Roles(UserRole.Admin)
    @ApiOkResponse({ type: UserResponseDto })
    async findOne(@Param('id') id: string) {
        return this.userService.findUserById(id);
    }

    @Get('email/:email')
    @Roles(UserRole.Admin)
    @ApiOkResponse({ type: UserResponseDto })
    async findByEmail(@Param('email') email: string) {
        return this.userService.findUserByEmail(email);
    }
}
