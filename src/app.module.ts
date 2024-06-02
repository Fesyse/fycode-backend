import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MulterModule } from "@nestjs/platform-express"
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { UserModule } from "@/user/user.module"
import { AuthModule } from "@/auth/auth.module"
import { ProblemModule } from "@/problem/problem.module"
import { APP_GUARD } from "@nestjs/core"

@Module({
	imports: [
		ConfigModule.forRoot(),
		ThrottlerModule.forRoot([
			{
				ttl: process.env.SERVER_MODE === "dev" ? 10 : 5000,
				limit: 10
			}
		]),
		MulterModule.register({
			dest: "./uploads/avatars",
			limits: {
				fieldSize: 1000 * 1000 * 4
			}
		}),
		AuthModule,
		UserModule,
		ProblemModule
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
