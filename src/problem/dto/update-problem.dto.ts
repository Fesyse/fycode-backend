import {
	IsString,
	IsEnum,
	IsOptional,
	IsObject,
	ValidateNested,
	IsArray,
	IsNumber,
	IsBoolean
} from "class-validator"
import { Difficulty } from "@prisma/client"
import { Type } from "class-transformer"
import { TestInputTypes } from "@/types"
import { CustomTest } from "./attempt-problem.dto"

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

export class OptionalTestsOptions {
	@IsOptional()
	@IsBoolean()
	useCustomTests?: boolean

	@IsOptional()
	@IsArray()
	@ValidateNested()
	@Type(() => CustomTest)
	tests?: CustomTest[]

	@IsOptional()
	@IsNumber()
	totalChecks?: number
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
	tags?: string[]

	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => OptionalTestsOptions)
	testsOptions?: OptionalTestsOptions

	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => OptionalFunctionOptions)
	functionOptions?: OptionalFunctionOptions

	@IsOptional()
	@IsString()
	solution?: string
}
