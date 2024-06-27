import { join } from "path"
import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { MulterModule } from "@nestjs/platform-express"
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler"
import { UserModule } from "@/user/user.module"
import { AuthModule } from "@/auth/auth.module"
import { ProblemModule } from "@/problem/problem.module"
import { APP_GUARD } from "@nestjs/core"
import { ServeStaticModule } from "@nestjs/serve-static"
import { AppController } from "./app.controller"

@Module({
	imports: [
		ConfigModule.forRoot(),
		// ServeStaticModule.forRoot({
		// 	rootPath: join(__dirname, "../", "client", ".next"),
		// 	exclude: ["api/*"]
		// }),
		ThrottlerModule.forRoot([
			{
				ttl: process.env.SERVER_MODE === "dev" ? 1 : 7500,
				limit: 10
			}
		]),
		MulterModule.register({
			dest: "./uploads/avatars",
			limits: {
				fieldSize: 1000 * 1000 * (process.env.SERVER_MODE === "dev" ? 100 : 4)
			}
		}),
		AuthModule,
		UserModule,
		ProblemModule
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard
		}
	]
})
export class AppModule {}
