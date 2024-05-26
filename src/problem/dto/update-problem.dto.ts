import {
	IsString,
	IsEnum,
	IsOptional,
	IsObject,
	ValidateNested,
	IsArray,
	IsNumber
} from "class-validator"
import { Difficulty } from "@prisma/client"
import { Type } from "class-transformer"
import { TestInputTypes } from "@/types"

export class OptionalFunctionOptions {
	@IsOptional()
	@IsString()
	name?: string

	@IsArray()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => OptionalFunctionArg)
	args?: OptionalFunctionArg[]

	@IsOptional()
	@IsNumber()
	totalChecks?: number
}

export class OptionalFunctionArg {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	@IsEnum(TestInputTypes)
	type?: TestInputTypes
}

export class UpdateProblemDto {
	@IsOptional()
	@IsString()
	title?: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsEnum(Difficulty)
	difficulty?: Difficulty

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags: string[]

	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => OptionalFunctionOptions)
	functionOptions?: OptionalFunctionOptions

	@IsOptional()
	@IsString()
	solution?: string
}
