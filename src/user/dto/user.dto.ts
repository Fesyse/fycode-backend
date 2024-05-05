import { IsEmail, IsString, MinLength } from "class-validator"

export class UserDto {
	@IsString()
	@MinLength(4, {
		message: "Username must be at least 4 characters long"
	})
	username: string

	@IsString()
	@IsEmail()
	email: string

	@MinLength(6, {
		message: "Password must be at least 6 characters long"
	})
	@IsString()
	password: string
}
