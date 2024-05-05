import { IsEnum, IsString } from "class-validator"
import { Difficulty } from "@prisma/client"

export class CreateProblemDto {
	@IsString()
	title: string

	@IsString()
	description: string

	@IsEnum(Difficulty)
	difficulty: Difficulty

	@IsString()
	functionName: string

	@IsString()
	solution: string
}
