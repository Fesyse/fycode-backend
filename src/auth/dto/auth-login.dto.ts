import { ApiProperty } from "@nestjs/swagger"
import { IsString, MinLength } from "class-validator"

export class AuthLoginDto {
	@ApiProperty()
	@IsString()
	email: string

	@ApiProperty({
		minLength: 6
	})
	@MinLength(6, {
		message: "Password must be at least 6 characters long"
	})
	@IsString()
	password: string
}
