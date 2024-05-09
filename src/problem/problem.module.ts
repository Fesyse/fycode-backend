import { Module } from "@nestjs/common"
import { ProblemService } from "./problem.service"
import { ProblemController } from "./problem.controller"
import { PrismaService } from "@/prisma.service"

@Module({
	controllers: [ProblemController],
	providers: [ProblemService, PrismaService],
	exports: [ProblemService]
})
export class ProblemModule {}
