import { IsString } from "class-validator"

export class SubmitProblemDto {
	@IsString()
	code: string
}
