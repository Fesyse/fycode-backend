import { Injectable } from "@nestjs/common"
import { CreateProblemDto } from "./dto/create-problem.dto"
import { UpdateProblemDto } from "./dto/update-problem.dto"
import { PrismaService } from "@/prisma.service"

@Injectable()
export class ProblemService {
	constructor(private prisma: PrismaService) {}

	async create(creatorId: string, createProblemDto: CreateProblemDto) {
		return this.prisma.problem.create({
			data: {
				...createProblemDto,
				creator: { connect: { id: creatorId } }
			}
		})
	}

	async update(problemId: number, updateProblemDto: UpdateProblemDto) {
		return this.prisma.problem.update({
			data: updateProblemDto,
			where: { id: problemId }
		})
	}
}
