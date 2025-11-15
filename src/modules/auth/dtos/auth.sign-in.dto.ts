import { ApiProperty } from '@nestjs/swagger';
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength,
    Matches,
} from 'class-validator';
import { PASSWORD_REGEX } from 'src/lib/constants';

export class AuthSignInDto {
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
        description: 'User password (minimum 8 characters)',
        example: 'password123',
        minLength: 8,
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

    @ApiProperty({
        description: 'Remember me',
        example: true,
    })
    @IsBoolean()
    @IsOptional()
    rememberMe?: boolean;
}
