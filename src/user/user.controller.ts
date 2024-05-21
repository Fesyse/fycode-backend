import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Patch,
	Put,
	UsePipes,
	ValidationPipe
} from "@nestjs/common"
import { UserService } from "./user.service"
import { Auth } from "src/auth/decorators/auth.decorator"
import { CurrentUser } from "src/auth/decorators/user.decorator"
import { UserUpdateDto } from "./dto/user-update.dto"
import { UpdateAvatarDto } from "./dto/update-avatar.dto"

@Controller("user")
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Auth()
	@Put("update")
	@UsePipes(new ValidationPipe())
	async update(
		@CurrentUser("id") id: string,
		@Body() updateUserDto: UserUpdateDto
	) {
		return this.userService.update(id, updateUserDto)
	}

	@Auth()
	@Get()
	async get(@CurrentUser("id") id: string) {
		return this.userService.getById(id, false)
	}

	@Auth()
	@Get("profile")
	async getProfile(@CurrentUser("id") id: string) {
		return this.userService.getById(id, false, {
			createdProblems: true,
			solvedProblems: true
		})
	}

	@Auth()
	@Patch("update-avatar")
	async updateAvatar(
		// @CurrentUser("id") userId: string,
		@Body() updateAvatarDto: UpdateAvatarDto
	) {
		Logger.log(updateAvatarDto)
		// return this.userService.updateAvatar(updateAvatarDto.avatar, userId)
	}

	@Auth()
	@Delete("remove-avatar")
	async removeAvatar(@CurrentUser("id") userId: string) {
		return this.userService.deleteAvatar(userId)
	}
}
