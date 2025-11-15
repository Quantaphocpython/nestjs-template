import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    address?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    birthday?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    isBlocked?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    logoId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    kyc_levels?: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_referral_bonus_paid?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsBoolean()
    is_referral_campaign_paid?: boolean;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    referral_code?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    referrer_code?: string;
}
