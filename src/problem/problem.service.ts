import { BadRequestException, Injectable } from "@nestjs/common"
import { PrismaService } from "@/prisma.service"
import { testSolution } from "./user-solution.test"
import { Prisma } from "@prisma/client"
import type {
	CreateProblemDto,
	FunctionOptions,
	TestsOptions
} from "./dto/create-problem.dto"
import type { UpdateProblemDto } from "./dto/update-problem.dto"
import { AttemptProblemDto, CustomTest } from "./dto/attempt-problem.dto"
import { SubmitProblemDto } from "./dto/submit-problem.dto"
import { codeSecurityCheck } from "@/utils"
import { GetSomeProblemsDto } from "./dto/get-some-problem.dto"

@Injectable()
export class ProblemService {
	constructor(private prisma: PrismaService) {}
	private PROBLE_GET_FIELDS_SELECT = {
		id: true,
		title: true,
		description: true,
		difficulty: true,
		likes: true,
		creator: {
			select: {
				id: true,
				avatar: true,
				username: true
			}
		}
	}

	async getById(problemId: number, userId: string | undefined) {
		try {
			const problem = await this.prisma.problem.findUnique({
				where: { id: problemId },
				select: this.PROBLE_GET_FIELDS_SELECT
			})
			if (!userId) return { ...problem, isLikedProblem: false }
			const isLikedProblem = !!(await this.prisma.problem.findFirst({
				where: {
					usersLiked: {
						some: { id: userId }
					}
				}
			}))
			return { ...problem, isLikedProblem }
		} catch {
			throw new BadRequestException("Problem with given id was not found")
		}
	}

	async getPopular(userId: string | undefined) {
		const problem = this.prisma.problem.findFirst({
			select: this.PROBLE_GET_FIELDS_SELECT,
			orderBy: {
				likes: "desc"
			}
		})
		if (!userId) return { ...problem, isLikedProblem: false }
		const isLikedProblem = !!(await this.prisma.problem.findFirst({
			where: {
				usersLiked: {
					some: { id: userId }
				}
			}
		}))
		return { ...problem, isLikedProblem }
	}

	async getSome({ pagination, filters, orderBy }: GetSomeProblemsDto) {
		return this.prisma.problem.findMany({
			where: {
				...filters,
				title: filters?.title ? { contains: filters.title } : undefined
			},
			select: {
				id: true,
				title: true,
				description: true,
				difficulty: true,
				likes: true
			},
			skip: pagination.page * pagination.pageSize,
			take: pagination.pageSize,
			orderBy: orderBy ?? { id: "asc" }
		})
	}

	async getMaxPage({ filters, pagination }: GetSomeProblemsDto) {
		const pageCount = await this.prisma.problem.count({ where: filters })
		return Math.floor(pageCount / pagination.pageSize)
	}

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
		const problem = await this.prisma.problem.create({
			data: {
				...createProblemDto,
				testsOptions,
				functionOptions,
				creator: { connect: { id: creatorId } }
			}
		})
		await this.prisma.user.update({
			where: { id: creatorId },
			data: {
				solvedProblems: {
					connect: { id: problem.id }
				}
			}
		})
		return problem
	}

	async delete(problemId: number, userId: string) {
		try {
			return await this.prisma.problem.delete({
				where: { id: problemId, creatorId: userId }
			})
		} catch {
			throw new BadRequestException(
				"Either you are not allowed to delete this problem, or problem id is not valid"
			)
		}
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
		try {
			return await this.prisma.problem.update({
				data: {
					...updateProblemDto,
					functionOptions
				},
				where: { id: problemId }
			})
		} catch {
			throw new BadRequestException(
				"Problem with given id was not found, or else.."
			)
		}
	}

	async updateUserSolvedProblems(problemId: number, userId: string) {
		return this.prisma.user.update({
			where: { id: userId },
			data: {
				solvedProblems: {
					connect: { id: problemId }
				}
			}
		})
	}

	async test(options: {
		problemId: number
		testProblemDto: AttemptProblemDto | SubmitProblemDto
	}) {
		const problem = await this.prisma.problem.findUnique({
			where: { id: options.problemId }
		})
		const code = options.testProblemDto.code.replaceAll("\\n", "\n")

		if (!problem)
			throw new BadRequestException("Problem with given id was not found")
		if (!codeSecurityCheck(code))
			throw new BadRequestException("Code is not valid")

		const handleBadCodeRequest = (message: string) => {
			throw new BadRequestException(message)
		}

		let customTests: undefined | CustomTest[] = undefined

		// @ts-expect-error checking if testProblemDto is typeof AttemptProblemDto
		// checking if data have .tests, if so assign it to customTests value
		if (options.testProblemDto.tests) customTests = options.testProblemDto.tests
		else {
			const testsOptions = problem.testsOptions as unknown as TestsOptions
			if (testsOptions.useCustomTests) customTests = testsOptions.tests
		}

		const testsOptions = problem.testsOptions as unknown as TestsOptions
		const functionOptions =
			problem.functionOptions as unknown as FunctionOptions
		return testSolution({
			solution: problem.solution,
			userSolution: code,
			testsOptions,
			customTests,
			functionOptions,
			handleBadCodeRequest
		})
	}

	async dislike(problemId: number, userId: string) {
		try {
			const isUserAlreadyDisliked = !!(await this.prisma.problem.findUnique({
				where: { id: problemId, usersLiked: { some: { id: userId } } }
			}))

			if (!isUserAlreadyDisliked) {
				await this.prisma.problem.update({
					where: {
						id: problemId
					},
					data: {
						likes: {
							decrement: 1
						},
						usersLiked: {
							connect: {
								id: userId
							}
						}
					}
				})
			}
			return true
		} catch {
			throw new BadRequestException("Problem with given id was not found.")
		}
	}

	async like(problemId: number, userId: string) {
		try {
			const isUserAlreadyLiked = !!(await this.prisma.problem.findUnique({
				where: { id: problemId, usersLiked: { some: { id: userId } } }
			}))

			if (!isUserAlreadyLiked) {
				await this.prisma.problem.update({
					where: {
						id: problemId
					},
					data: {
						likes: {
							increment: 1
						},
						usersLiked: {
							connect: {
								id: userId
							}
						}
					}
				})
			}
			return true
		} catch {
			throw new BadRequestException("Problem with given id was not found.")
		}
	}
}
