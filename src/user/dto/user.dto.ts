import {
	IsEmail,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength,
	MinLength
} from "class-validator"

export class UserDto {
	@IsString()
	@MinLength(4, {
		message: "Username must be at least 4 characters long"
	})
	username: string

	@IsString()
	@IsEmail()
	email: string

	@IsString()
	@MinLength(8, {
		message: "Password must be at least 8 characters long"
	})
	@MaxLength(30, {
		message: "Password must be at most 30 characters long"
	})
	password: string

	@IsOptional()
	@IsString()
	@IsUrl()
	image?: string
}
