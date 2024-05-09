import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "@/prisma.service"
import { testSolution, type TestsResult } from "./user-solution.spec"
import { Prisma } from "@prisma/client"
import type {
	CreateProblemDto,
	FunctionOptions,
	TestsOptions
} from "./dto/create-problem.dto"
import type { UpdateProblemDto } from "./dto/update-problem.dto"
import { AttemptProblemDto, AttemptTest } from "./dto/attempt-problem.dto"
import { SubmitProblemDto } from "./dto/submit-problem.dto"
import { codeSecurityCheck } from "@/utils"

@Injectable()
export class ProblemService {
	constructor(private prisma: PrismaService) {}

	async create(creatorId: string, createProblemDto: CreateProblemDto) {
		const testsOptions =
			createProblemDto.testsOptions as unknown as Prisma.JsonObject
		const functionOptions =
			createProblemDto.functionOptions as unknown as Prisma.JsonObject
		try {
			eval(createProblemDto.solution)
		} catch (e) {
			throw new BadRequestException(e)
		}
		return this.prisma.problem.create({
			data: {
				...createProblemDto,
				testsOptions,
				functionOptions,
				creator: { connect: { id: creatorId } }
			}
		})
	}

	async update(problemId: number, updateProblemDto: UpdateProblemDto) {
		const functionOptions =
			updateProblemDto.functionOptions as unknown as Prisma.JsonObject
		if (updateProblemDto.solution) {
			try {
				eval(updateProblemDto.solution)
			} catch (e) {
				throw new BadRequestException(e)
			}
		}
		return this.prisma.problem.update({
			data: {
				...updateProblemDto,
				functionOptions
			},
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
		else {
			const testsOptions = problem.testsOptions as unknown as TestsOptions
			if (testsOptions.useCustomTests) attemptTests = testsOptions.tests
		}

		const testsOptions = problem.testsOptions as unknown as TestsOptions
		const functionOptions =
			problem.functionOptions as unknown as FunctionOptions
		return testSolution({
			solution: problem.solution,
			userSolution: testProblemDto.code,
			testsOptions,
			attemptTests,
			functionOptions,
			handleBadCodeRequest
		})
	}
}
