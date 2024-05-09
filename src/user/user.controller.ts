import {
	Body,
	Controller,
	Get,
	HttpCode,
	Put,
	UsePipes,
	ValidationPipe
} from "@nestjs/common"
import { UserService } from "./user.service"
import { Auth } from "src/auth/decorators/auth.decorator"
import { CurrentUser } from "src/auth/decorators/user.decorator"
import { UserUpdateDto } from "./dto/user-update.dto"

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Auth()
	@Put("update")
	@HttpCode(200)
	@UsePipes(new ValidationPipe())
	async update(
		@CurrentUser("id") id: string,
		@Body() updateUserDto: UserUpdateDto
	) {
		return this.userService.update(id, updateUserDto)
	}

	@Auth()
	@HttpCode(200)
	@Get("profile")
	async getProfile(@CurrentUser("id") id: string) {
		return this.userService.getById(id, false, {
			createdProblems: true,
			solvedProblems: true
		})
	}
}
