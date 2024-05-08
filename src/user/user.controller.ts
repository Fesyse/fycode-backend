import {
	Body,
	Controller,
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
	async updateProfile(
		@CurrentUser("id") id: string,
		@Body() updateUserDto: UserUpdateDto
	) {
		return this.userService.update(id, updateUserDto)
	}
}
