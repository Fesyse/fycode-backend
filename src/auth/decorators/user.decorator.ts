import {
	ExecutionContext,
	UnauthorizedException,
	createParamDecorator
} from "@nestjs/common"
import { User } from "@prisma/client"

export const CurrentUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user as User | undefined

		if (!user) throw new UnauthorizedException("Unauthorized")

		return data ? user[data] : user
	}
)
