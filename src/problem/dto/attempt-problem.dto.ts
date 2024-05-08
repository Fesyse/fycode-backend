import { Type } from "class-transformer"
import { IsArray, IsString, ValidateNested } from "class-validator"

export class AttemptProblemDto {
	@IsString()
	code: string

	@IsArray()
	@ValidateNested()
	@Type(() => AttemptTest)
	tests: AttemptTest[]
}

export class AttemptTest {
	@IsArray()
	input: any[]
}
