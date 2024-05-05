import { IsOptional, IsString, MinLength } from "class-validator"

export class UserUpdateDto {
	@IsOptional()
	@IsString()
	@MinLength(4, {
		message: "Username must be at least 4 characters long"
	})
	username: string

	@IsOptional()
	@IsString()
	email: string

	@IsOptional()
	@MinLength(6, {
		message: "Password must be at least 6 characters long"
	})
	@IsString()
	password: string
}
