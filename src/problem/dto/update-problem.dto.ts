import { IsString, IsEnum, IsOptional } from "class-validator"
import { Difficulty } from "@prisma/client"

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
	@IsString()
	solution?: string
}
