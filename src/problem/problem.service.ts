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
import { codeSecurityCheck, getMinifiedCode } from "@/utils"

@Injectable()
export class ProblemService {
	constructor(private prisma: PrismaService) {}

	async create(creatorId: string, createProblemDto: CreateProblemDto) {
		const functionOptions =
			createProblemDto.functionOptions as unknown as Prisma.JsonObject
		const solution = getMinifiedCode(createProblemDto.solution)
		return this.prisma.problem.create({
			data: {
				...createProblemDto,
				solution,
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
		if (!codeSecurityCheck(testProblemDto.code))
			throw new BadRequestException("Code is not valid")

		const handleBadCodeRequest = (message: string) => {
			throw new BadRequestException(message)
		}

		// checking if data have .tests, if so assign it to attemptTests value
		let attemptTests: undefined | AttemptTest[] = undefined

		// eslint-disable-next-line  @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		if (testProblemDto.tests) attemptTests = testProblemDto.tests

		const functionOptions =
			problem.functionOptions as unknown as FunctionOptions
		return testSolution({
			solution: problem.solution,
			userSolution: getMinifiedCode(testProblemDto.code),
			attemptTests,
			functionOptions,
			handleBadCodeRequest
		})
	}
}
