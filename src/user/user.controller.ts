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

	@UsePipes(new ValidationPipe())
	@Put()
	@HttpCode(200)
	@Auth()
	async updateProfile(
		@CurrentUser("id") id: string,
		@Body() dto: UserUpdateDto
	) {
		return this.userService.update(id, dto)
	}
}
