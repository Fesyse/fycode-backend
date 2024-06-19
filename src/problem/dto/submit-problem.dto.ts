import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class SubmitProblemDto {
	@ApiProperty()
	@IsString()
	code: string
}
