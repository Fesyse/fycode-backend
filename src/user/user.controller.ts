import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Put,
	Res,
	UploadedFile,
	UseInterceptors,
	UsePipes,
	ValidationPipe
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { UserService } from "./user.service"
import { Auth } from "src/auth/decorators/auth.decorator"
import { CurrentUser } from "@/auth/decorators/user.decorator"
import { UserUpdateDto } from "./dto/user-update.dto"
import { diskStorage } from "multer"
import { extname } from "path"
import { User } from "@prisma/client"

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

	@Get("profile/:id")
	async getProfile(@Param("id") id: string) {
		return this.userService.getById(id, false, {
			problems: true
		})
	}

	@Get("problems-count/:id")
	async getProblemsCount(@Param("id") id: string) {
		return this.userService.getProblemsCount(id)
	}

	@Auth()
	@Patch("update-avatar")
	@UseInterceptors(
		FileInterceptor("avatar", {
			storage: diskStorage({
				destination: "./uploads/avatars",
				filename: (req, file, callback) => {
					const originalFileName = file.originalname.split(".")[0]
					const fileExtension = extname(file.originalname)
					const filename = `${originalFileName}_${(req.user as User).id}_${new Date().getTime()}${fileExtension}`
					callback(null, filename)
				}
			})
		})
	)
	async updateAvatar(
		@UploadedFile()
		avatar: Express.Multer.File,
		@CurrentUser("id") userId: string
	) {
		return this.userService.updateAvatar(avatar, userId)
	}

	@Auth()
	@Delete("remove-avatar")
	async removeAvatar(@CurrentUser("id") userId: string) {
		return this.userService.removeAvatar(userId)
	}

	@Get("avatar/:path")
	async returnAvatarImage(@Param("path") path: string, @Res() response) {
		return response.sendFile(path, { root: "./uploads/avatars" })
	}
}
