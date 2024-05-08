import { Injectable } from "@nestjs/common"
import { hash } from "argon2"
import { AuthRegisterDto } from "src/auth/dto/auth-register.dto"
import { PrismaService } from "src/prisma.service"
import { UserUpdateDto } from "./dto/user-update.dto"

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {}

	async getById(id: string) {
		return this.prisma.user.findUnique({
			where: { id }
		})
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
			username: dto.username,
			email: dto.email,
			password: dto.password ? await hash(dto.password) : undefined
		}

		return this.prisma.user.update({
			where: { id },
			data
		})
	}
}
