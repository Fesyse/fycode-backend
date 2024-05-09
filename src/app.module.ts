import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { UserModule } from "@/user/user.module"
import { AuthModule } from "@/auth/auth.module"
import { ProblemModule } from "./problem/problem.module"

@Module({
	imports: [ConfigModule.forRoot(), AuthModule, UserModule, ProblemModule]
})
export class AppModule {}
