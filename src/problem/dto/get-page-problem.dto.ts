import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Difficulty } from "@prisma/client"
import { Type } from "class-transformer"
import {
	IsEnum,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested
} from "class-validator"

enum Order {
	ASC = "asc",
	DESC = "desc"
}

class Pagination {
	@ApiProperty({
		type: Number
	})
	@IsNumber()
	page: number

	@ApiProperty({
		type: Number
	})
	@IsNumber()
	pageSize: number
}

class Filters {
	@ApiPropertyOptional({
		enum: Difficulty
	})
	@IsOptional()
	@IsString()
	@IsEnum(Difficulty)
	difficulty?: Difficulty

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	title?: string
}

class OrderBy {
	@ApiPropertyOptional({
		enum: Order
	})
	@IsOptional()
	@IsString()
	@IsEnum(Order)
	id?: Order

	@ApiPropertyOptional({
		enum: Order
	})
	@IsOptional()
	@IsString()
	@IsEnum(Order)
	likes?: Order
}

export class GetPageProblemsDto {
	@ApiProperty({
		type: () => Pagination
	})
	@IsObject()
	@ValidateNested()
	@Type(() => Pagination)
	pagination: Pagination

	@ApiPropertyOptional({
		type: () => Filters
	})
	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => Filters)
	filters?: Filters

	@ApiPropertyOptional({
		type: () => OrderBy
	})
	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => OrderBy)
	orderBy?: OrderBy
}
