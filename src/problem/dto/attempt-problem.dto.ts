import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsArray, IsString, ValidateNested } from "class-validator"

export class CustomTest {
	@ApiProperty({
		description:
			"Type is actually any, because swagger does not support any type.",
		isArray: true
	})
	@IsArray()
	input: any[]
}

export class AttemptProblemDto {
	@ApiProperty()
	@IsString()
	code: string

	@ApiProperty({
		type: () => CustomTest,
		isArray: true
	})
	@IsArray()
	@ValidateNested()
	@Type(() => CustomTest)
	tests: CustomTest[]
}
