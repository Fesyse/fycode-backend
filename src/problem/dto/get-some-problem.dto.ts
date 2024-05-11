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

export class Pagination {
	@IsNumber()
	page: number

	@IsNumber()
	pageSize: number
}

export class GetSomeProblemsDto {
	@IsObject()
	@ValidateNested()
	@Type(() => Pagination)
	pagination: Pagination

	@IsString()
	@IsOptional()
	@IsEnum(Difficulty)
	difficulty?: Difficulty
}
