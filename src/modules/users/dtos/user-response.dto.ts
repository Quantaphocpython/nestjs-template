import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

export class UserResponseDto {
    @ApiProperty({ example: 'uuid-1234' })
    id: string;

    @ApiProperty({ example: 'john@example.com' })
    email: string;

    @ApiProperty({ example: 'John' })
    name: string | null;

    @ApiProperty({ example: 'https://example.com/avatar.jpg' })
    image: string | null;

    @ApiProperty({ example: '1234567890' })
    address: string | null;

    @ApiProperty({ example: true })
    @IsString()
    birthday: Date | null;

    @ApiProperty({ example: true })
    @IsBoolean()
    isBlocked: boolean | null;

    @ApiProperty({ example: UserRole.User })
    role: UserRole;

    @Exclude()
    avatarId: string | null;

    @Exclude()
    logoId: string | null;

    @Exclude()
    phone: string | null;

    @Exclude()
    isDeleted: boolean;

    @Exclude()
    kyc_levels: string[];

    @Exclude()
    is_referral_bonus_paid: boolean | null;

    @Exclude()
    is_referral_campaign_paid: boolean | null;

    @Exclude()
    referral_code: string | null;

    @Exclude()
    referrer_code: string | null;

    @Exclude()
    password?: string;
}
