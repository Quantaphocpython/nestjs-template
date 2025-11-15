import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from 'class-validator';
import { PASSWORD_REGEX } from 'src/lib/constants';

export class AuthSignUpDto {
    @ApiProperty({
        description: 'User email address',
        example: 'test@example.com',
        format: 'email',
    })
    @IsEmail()
    @IsNotEmpty()
    @MaxLength(50)
    email!: string;

    @ApiProperty({
        description:
            'User password (8–16 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character)',
        example: 'Password@123',
        minLength: 8,
        maxLength: 16,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    @Matches(PASSWORD_REGEX, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    password!: string;
}
