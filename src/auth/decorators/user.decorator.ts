import { ExecutionContext, createParamDecorator } from "@nestjs/common"
import { User } from "@prisma/client"

export const CurrentUser = createParamDecorator(
	(data: keyof User, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest()
		const user = request.user as User | undefined

		if (!user) return undefined

		return data ? user[data] : user
	}
)
