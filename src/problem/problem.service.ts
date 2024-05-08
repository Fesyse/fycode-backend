import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "@/prisma.service"
import { testSolution, type TestsResult } from "./user-solution.spec"
import { Prisma } from "@prisma/client"
import type {
	CreateProblemDto,
	FunctionOptions
} from "./dto/create-problem.dto"
import type { UpdateProblemDto } from "./dto/update-problem.dto"
import { AttemptProblemDto, AttemptTest } from "./dto/attempt-problem.dto"
import { SubmitProblemDto } from "./dto/submit-problem.dto"

@Injectable()
export class ProblemService {
	constructor(private prisma: PrismaService) {}

	async create(creatorId: string, createProblemDto: CreateProblemDto) {
		const functionOptions =
			createProblemDto.functionOptions as unknown as Prisma.JsonObject
		return this.prisma.problem.create({
			data: {
				...createProblemDto,
				functionOptions,
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

	async test(
		problemId: number,
		testProblemDto?: AttemptProblemDto | SubmitProblemDto
	): Promise<TestsResult> {
		const problem = await this.prisma.problem.findUnique({
			where: { id: problemId }
		})
		if (!problem)
			throw new BadRequestException("Problem with given id was not found")

		// checking if data have .attemptTests, if so assign it to attemptTests value
		let attemptTests: undefined | AttemptTest[] = undefined
		if (testProblemDto instanceof AttemptProblemDto)
			attemptTests = testProblemDto.tests

		const functionOptions =
			problem.functionOptions as unknown as FunctionOptions
		return testSolution({
			attemptTests,
			functionOptions
		})
	}
}
