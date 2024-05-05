import { Type } from "class-transformer"
import { IsArray, IsObject, IsString, ValidateNested } from "class-validator"

export class AttemptProblemDto {
	@IsString()
	code: string

	@IsObject()
	@ValidateNested()
	@Type(() => AttemptTest)
	tests: AttemptTest[]
}

export class AttemptTest {
	@IsArray()
	input: any[]
}
