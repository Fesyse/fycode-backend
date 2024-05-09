import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException
} from "@nestjs/common"
import { UserService } from "src/user/user.service"
import { AuthLoginDto } from "./dto/auth-login.dto"
import { AuthRegisterDto } from "./dto/auth-register.dto"
import { JwtService } from "@nestjs/jwt"
import { verify } from "argon2"
import { Response } from "express"

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private userService: UserService
	) {}
	EXPIRE_DAY_REFRESH_TOKEN = 1
	REFRESH_TOKEN_NAME = "refreshToken"

	async login(dto: AuthLoginDto) {
		const user = await this.validateUser(dto)
		const tokens = this.issueTokens(user.id)
		user.password = undefined

		return { user, ...tokens }
	}
	async register(dto: AuthRegisterDto) {
		const isUser = !!(await this.userService.getByEmail(dto.email))
		if (isUser) throw new BadRequestException("User already exists")

		const user = await this.userService.create(dto)
		const tokens = this.issueTokens(user.id)
		user.password = undefined

		return { user, ...tokens }
	}

	private issueTokens(userId: string) {
		const data = { id: userId }
		const accessToken = this.jwt.sign(data, {
			expiresIn: "1hr"
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: "7d"
		})

		return { refreshToken, accessToken }
	}
	private async validateUser(dto: AuthLoginDto) {
		const user = await this.userService.getByEmail(dto.email)
		if (!user) throw new NotFoundException("User not found")

		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException("Invalid password")

		return user
	}

	addRefreshTokenToResponse(res: Response, refreshToken: string) {
		const expiresIn = new Date()
		expiresIn.setDate(expiresIn.getDate() + this.EXPIRE_DAY_REFRESH_TOKEN)

		res.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			domain: "localhost",
			expires: expiresIn,
			secure: true,

			sameSite: "none"
		})
	}
	removeRefreshTokenToResponse(res: Response) {
		res.cookie(this.REFRESH_TOKEN_NAME, "", {
			httpOnly: true,
			domain: "localhost",
			expires: new Date(0),
			secure: true,

			sameSite: "none"
		})
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken)
		if (!result) throw new UnauthorizedException("Invalid refresh token")

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const user = await this.userService.getById(result.id)
		const tokens = this.issueTokens(user.id)

		return {
			user: {
				...user,
				password: undefined
			},
			...tokens
		}
	}
}
