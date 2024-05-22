import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { UserModule } from "@/user/user.module"
import { AuthModule } from "@/auth/auth.module"
import { ProblemModule } from "./problem/problem.module"
import { MulterModule } from "@nestjs/platform-express"

@Module({
	imports: [
		ConfigModule.forRoot(),
		MulterModule.register({
			dest: "./uploads/avatars",
			limits: {
				fieldSize: 1000 * 1000 * 4
			}
		}),
		AuthModule,
		UserModule,
		ProblemModule
	]
})
export class AppModule {}
