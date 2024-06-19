import { ApiProperty } from "@nestjs/swagger"
import { IsString, MaxLength, MinLength } from "class-validator"

export class AuthRegisterDto {
	@ApiProperty({
		minLength: 4,
		maxLength: 12
	})
	@IsString()
	@MinLength(4, {
		message: "Username must be at least 4 characters long"
	})
	@MaxLength(12, {
		message: "Username must be at most 12 characters long"
	})
	username: string

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
