import { IsFile } from "../decorators/is-file.decorator"

export class UpdateAvatarDto {
	@IsFile(
		{ mime: ["image/jpg", "image/jpeg", "image/png"] },
		{ message: "Avatar must be a file" }
	)
	avatar: any
}
