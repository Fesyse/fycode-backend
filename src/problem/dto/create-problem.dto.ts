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
import { CustomTest } from "./attempt-problem.dto"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class TestsOptions {
	@ApiProperty({
		type: Boolean
	})
	@IsBoolean()
	useCustomTests: boolean

	@ApiPropertyOptional({
		type: () => CustomTest,
		isArray: true
	})
	@IsOptional()
	@IsArray()
	@ValidateNested()
	@Type(() => CustomTest)
	tests?: CustomTest[]

	@ApiProperty({
		type: Number,
		default: 100
	})
	@IsOptional()
	@IsNumber()
	totalChecks?: number
}

export class FunctionArg {
	@ApiProperty()
	@IsString()
	name: string

	@ApiProperty({
		enum: TestInputTypes
	})
	@IsString()
	@IsEnum(TestInputTypes)
	type: TestInputTypes
}

export class FunctionOptions {
	@ApiProperty()
	@IsString()
	name: string

	@ApiProperty({
		type: () => FunctionArg,
		isArray: true
	})
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => FunctionArg)
	args: FunctionArg[]
}

export class CreateProblemDto {
	@ApiProperty()
	@IsString()
	title: string

	@ApiProperty()
	@IsString()
	description: string

	@ApiProperty({
		enum: Difficulty
	})
	@IsEnum(Difficulty)
	difficulty: Difficulty

	@ApiProperty({
		type: String,
		isArray: true
	})
	@IsArray()
	@IsString({ each: true })
	tags: string[]

	@ApiProperty({
		type: () => TestsOptions
	})
	@IsObject()
	@ValidateNested()
	@Type(() => TestsOptions)
	testsOptions: TestsOptions

	@ApiProperty({
		type: () => FunctionOptions
	})
	@IsObject()
	@ValidateNested()
	@Type(() => FunctionOptions)
	functionOptions: FunctionOptions

	@ApiProperty()
	@IsString()
	solution: string
}
