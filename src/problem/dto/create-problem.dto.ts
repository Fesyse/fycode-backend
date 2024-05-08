import {
	IsObject,
	IsEnum,
	IsString,
	ValidateNested,
	IsArray,
	IsNumber
} from "class-validator"
import { Difficulty } from "@prisma/client"
import { Type } from "class-transformer"
import { TestInputTypes } from "@/types"

export class FunctionOptions {
	@IsString()
	name: string

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => FunctionArg)
	args: FunctionArg[]

	@IsNumber()
	totalChecks: number
}

export class FunctionArg {
	@IsString()
	name: string

	@IsString()
	@IsEnum(TestInputTypes)
	type: TestInputTypes
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
	@Type(() => FunctionOptions)
	functionOptions: FunctionOptions

	@IsString()
	solution: string
}
