import { ApiProperty } from '@nestjs/swagger';

// Metadata DTO
export class PaginationMetaDto {
    @ApiProperty({ example: 1, description: 'The current page number' })
    page: number;

    @ApiProperty({ example: 10, description: 'The number of items per page' })
    limit: number;

    @ApiProperty({ example: 100, description: 'The total number of items' })
    total: number;

    @ApiProperty({ example: 10, description: 'The total number of pages' })
    totalPages: number;

    @ApiProperty({ example: true, description: 'Whether there is a next page' })
    hasNextPage: boolean;

    @ApiProperty({
        example: false,
        description: 'Whether there is a previous page',
    })
    hasPreviousPage: boolean;
}
