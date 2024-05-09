import { Type } from "class-transformer"
import { IsArray, IsString, ValidateNested } from "class-validator"

export class AttemptProblemDto {
	@IsString()
	code: string

	@IsArray()
	@ValidateNested()
	@Type(() => CustomTest)
	tests: CustomTest[]
}

export class CustomTest {
	@IsArray()
	input: any[]
}
