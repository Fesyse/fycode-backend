import { BadRequestException, Injectable } from "@nestjs/common"
import { hash } from "argon2"
import { User } from "@prisma/client"
import * as fs from "fs"
import { AuthRegisterDto } from "@/auth/dto/auth-register.dto"
import { PrismaService } from "@/prisma.service"
import { UserUpdateDto } from "./dto/user-update.dto"

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(
		id: string,
		includePassword: boolean = true,
		include?: { createdProblems?: boolean; solvedProblems?: boolean }
	) {
		const selectFieldsProblem = {
			id: true,
			title: true,
			difficulty: true
		}
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: {
				createdProblems: include?.createdProblems
					? { select: selectFieldsProblem }
					: false,
				solvedProblems: include?.solvedProblems
					? { select: selectFieldsProblem }
					: false
			}
		})
		return { ...user, password: includePassword ? user.password : undefined }
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email }
		})
	}

	async create(dto: AuthRegisterDto) {
		const { email, username, password } = dto
		const user = { email, username, password: await hash(password) }
		return this.prisma.user.create({
			data: user
		})
	}

	async update(id: string, dto: UserUpdateDto) {
		const data: UserUpdateDto = {
			...dto,
			password: dto.password ? await hash(dto.password) : undefined
		}

		const user = await this.prisma.user.update({
			where: { id },
			data
		})
		return { ...user, password: undefined }
	}

	async updateAvatar(avatar: Express.Multer.File, userId: string) {
		await this.removeAvatar(userId)
		const user = await this.prisma.user.update({
			where: { id: userId },
			data: {
				avatar: `${process.env.BASE_URL}/user/avatar/${avatar.filename}`
			},
			select: {
				id: true,
				username: true,
				email: true,
				avatar: true,
				password: false
			}
		})

		return user
	}

	async removeAvatar(userId: string) {
		let user: User = await this.prisma.user.findUnique({
			where: { id: userId }
		})
		if (!user.avatar) return user

		const filePathname = `./uploads/avatars/${user.avatar.slice(
			(process.env.BASE_URL + "/user/avatar/").length,
			user.avatar.length
		)}`

		fs.stat(filePathname, function (err) {
			const badRequest = new BadRequestException(
				"Cannot find file with given pathname " + filePathname
			)
			if (err) throw badRequest
			fs.unlink(filePathname, _err => {
				if (_err) throw badRequest
			})
		})
		user = await this.prisma.user.update({
			where: { id: user.id },
			data: { avatar: null }
		})

		return user
	}
}
