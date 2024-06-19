import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import {
	IsEmail,
	IsOptional,
	IsString,
	IsUrl,
	MaxLength,
	MinLength
} from "class-validator"

export class UserDto {
	@ApiProperty()
	@IsString()
	@MinLength(4, {
		message: "Username must be at least 4 characters long"
	})
	username: string

	@ApiProperty()
	@IsString()
	@IsEmail()
	email: string

	@ApiProperty()
	@IsString()
	@MinLength(8, {
		message: "Password must be at least 8 characters long"
	})
	@MaxLength(30, {
		message: "Password must be at most 30 characters long"
	})
	password: string

	@ApiPropertyOptional()
	@IsOptional()
	@IsString()
	@IsUrl()
	image?: string
}
