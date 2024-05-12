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
	@IsNumber()
	page: number

	@IsNumber()
	pageSize: number
}

class Filters {
	@IsOptional()
	@IsString()
	@IsEnum(Difficulty)
	difficulty?: Difficulty
}

class OrderBy {
	@IsOptional()
	@IsString()
	@IsEnum(Order)
	id?: Order

	@IsOptional()
	@IsString()
	@IsEnum(Order)
	likes?: Order
}

export class GetSomeProblemsDto {
	@IsObject()
	@ValidateNested()
	@Type(() => Pagination)
	pagination: Pagination

	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => Filters)
	filters?: Filters

	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => OrderBy)
	orderBy?: OrderBy
}
