import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'john@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123' })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @ApiProperty({ example: '1234567890' })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ example: '1234567890' })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ example: '2025-10-29' })
    @IsString()
    @IsOptional()
    birthday?: string;
}
