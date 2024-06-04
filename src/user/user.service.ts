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
		include?: { password?: boolean; problems?: boolean }
	) {
		const selectFieldsProblem = {
			id: true,
			title: true,
			difficulty: true
		}
		const user = await this.prisma.user.findUnique({
			where: { id },
			include: include?.problems
				? {
						createdProblems: { select: selectFieldsProblem },
						solvedProblems: { select: selectFieldsProblem },
						dislikedProblems: { select: selectFieldsProblem },
						likedProblems: { select: selectFieldsProblem }
					}
				: undefined
		})

		let lastSolvedProblem = undefined
		if (include?.problems)
			lastSolvedProblem = await this.prisma.problem.findFirst({
				where: { usersSolved: { some: { id } } },
				select: { id: true, title: true }
			})

		if (!user)
			throw new BadRequestException("User with given id was not found.")

		return {
			...user,
			lastSolvedProblem,
			password: include?.password ? user.password : undefined
		}
	}

	async getByEmail(email: string) {
		return this.prisma.user.findUnique({
			where: { email }
		})
	}

	async getProblemsCount(userId: string) {
		const usersSolved = { none: { id: userId } }

		const [
			problems,
			easyProblems,
			mediumProblems,
			hardProblems,
			userProblems,
			userEasyProblems,
			userMediumProblems,
			userHardProblems
		] = await this.prisma.$transaction([
			this.prisma.problem.count(),
			this.prisma.problem.count({
				where: { difficulty: "easy" }
			}),
			this.prisma.problem.count({
				where: { difficulty: "medium" }
			}),
			this.prisma.problem.count({
				where: { difficulty: "hard" }
			}),
			this.prisma.problem.count({ where: { usersSolved } }),
			this.prisma.problem.count({
				where: { difficulty: "easy", usersSolved }
			}),
			this.prisma.problem.count({
				where: { difficulty: "medium", usersSolved }
			}),
			this.prisma.problem.count({
				where: { difficulty: "hard", usersSolved }
			})
		])

		return {
			problems,
			easyProblems,
			mediumProblems,
			hardProblems,
			userProblems,
			userEasyProblems,
			userMediumProblems,
			userHardProblems
		}
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
