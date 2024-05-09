import {
	IsObject,
	IsEnum,
	IsString,
	ValidateNested,
	IsArray,
	IsNumber,
	IsOptional,
	IsBoolean
} from "class-validator"
import { Difficulty } from "@prisma/client"
import { Type } from "class-transformer"
import { TestInputTypes } from "@/types"
import { AttemptTest } from "./attempt-problem.dto"

export class TestsOptions {
	@IsBoolean()
	useCustomTests: boolean

	@IsOptional()
	@IsArray()
	@ValidateNested()
	@Type(() => AttemptTest)
	tests?: AttemptTest[]

	@IsOptional()
	@IsNumber()
	totalChecks?: number
}

export class FunctionArg {
	@IsString()
	name: string

	@IsString()
	@IsEnum(TestInputTypes)
	type: TestInputTypes
}

export class FunctionOptions {
	@IsString()
	name: string

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => FunctionArg)
	args: FunctionArg[]
}

export class CreateProblemDto {
	@IsString()
	title: string

	@IsString()
	description: string

	@IsEnum(Difficulty)
	difficulty: Difficulty

	@IsObject()
	@ValidateNested()
	@Type(() => TestsOptions)
	testsOptions: TestsOptions

	@IsObject()
	@ValidateNested()
	@Type(() => FunctionOptions)
	functionOptions: FunctionOptions

	@IsString()
	solution: string
}
