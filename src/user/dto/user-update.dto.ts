import { ApiPropertyOptional } from "@nestjs/swagger"
import {
	IsEmail,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength,
	MinLength
} from "class-validator"

export class UserUpdateDto {
	@ApiPropertyOptional({
		minLength: 4,
		maxLength: 12
	})
	@IsOptional()
	@IsString()
	@MinLength(4, {
		message: "Username must be at least 4 characters long"
	})
	@MaxLength(12, {
		message: "Username must be at most 12 characters long"
	})
	username?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@IsEmail()
	email?: string

	@ApiPropertyOptional({
		minLength: 4
	})
	@IsOptional()
	@IsString()
	@MinLength(6, {
		message: "Password must be at least 6 characters long"
	})
	password?: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@IsUrl()
	avatar?: string
}
