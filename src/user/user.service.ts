import { Injectable } from "@nestjs/common"
import { hash } from "argon2"
import { AuthRegisterDto } from "src/auth/dto/auth-register.dto"
import { PrismaService } from "src/prisma.service"
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

	async updateAvatar(userId: string) {
		const data = { url: "test" }
		const user = await this.prisma.user.update({
			where: { id: userId },
			data: { avatar: data.url }
		})

		return user
	}

	async deleteAvatar(userId: string) {
		const { avatar } = await this.prisma.user.findUnique({
			where: { id: userId }
		})

		const data = { success: true }
		return data
	}
}
