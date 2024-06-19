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
import { ApiPropertyOptional } from "@nestjs/swagger"

export class OptionalFunctionArg {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	name?: string

	@ApiPropertyOptional({
		enum: TestInputTypes
	})
	@IsOptional()
	@IsString()
	@IsEnum(TestInputTypes)
	type?: TestInputTypes
}

export class OptionalTestsOptions {
	@ApiPropertyOptional({
		type: Boolean
	})
	@IsOptional()
	@IsBoolean()
	useCustomTests?: boolean

	@ApiPropertyOptional({
		type: () => CustomTest,
		isArray: true
	})
	@IsOptional()
	@IsArray()
	@ValidateNested()
	@Type(() => CustomTest)
	tests?: CustomTest[]

	@ApiPropertyOptional({
		type: Number
	})
	@IsOptional()
	@IsNumber()
	totalChecks?: number
}

export class OptionalFunctionOptions {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	name?: string

	@ApiPropertyOptional({
		type: () => OptionalFunctionArg,
		isArray: true
	})
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OptionalFunctionArg)
	args?: OptionalFunctionArg[]

	@ApiPropertyOptional({
		type: Number
	})
	@IsOptional()
	@IsNumber()
	totalChecks?: number
}

export class UpdateProblemDto {
	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	title?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	description?: string

	@ApiPropertyOptional({
		enum: Difficulty
	})
	@IsOptional()
	@IsEnum(Difficulty)
	difficulty?: Difficulty

	@ApiPropertyOptional({
		type: String,
		isArray: true
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	tags?: string[]

	@ApiPropertyOptional({
		type: () => OptionalTestsOptions
	})
	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => OptionalTestsOptions)
	testsOptions?: OptionalTestsOptions

	@ApiPropertyOptional({
		type: () => OptionalFunctionOptions
	})
	@IsOptional()
	@IsObject()
	@ValidateNested()
	@Type(() => OptionalFunctionOptions)
	functionOptions?: OptionalFunctionOptions

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	solution?: string
}
