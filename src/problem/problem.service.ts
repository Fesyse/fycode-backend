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
import { GetPageProblemsDto } from "./dto/get-some-problem.dto"

@Injectable()
export class ProblemService {
	constructor(private prisma: PrismaService) {}
	private PROBLEM_GET_FIELDS_SELECT: Prisma.ProblemFindUniqueArgs["select"] = {
		id: true,
		title: true,
		description: true,
		difficulty: true,
		likes: true,
		tags: true,
		creator: {
			select: {
				id: true,
				avatar: true,
				username: true
			}
		},
		functionOptions: true
	}

	async getById(problemId: number, userId: string | undefined) {
		try {
			const problem = isNaN(problemId)
				? await this.getPopular()
				: await this.prisma.problem.findUnique({
						where: { id: problemId },
						select: this.PROBLEM_GET_FIELDS_SELECT
					})
			if (!problem)
				throw new BadRequestException("Problem with given id was not found")
			if (!userId) return { ...problem, isLikedProblem: false }
			const isLikedProblem = !!(await this.prisma.problem.findFirst({
				where: {
					usersLiked: {
						some: { id: userId }
					}
				}
			}))
			const isDislikedProblem = !!(await this.prisma.problem.findFirst({
				where: {
					usersDisliked: {
						some: { id: userId }
					}
				}
			}))
			return { ...problem, isLikedProblem, isDislikedProblem }
		} catch {
			throw new BadRequestException("Problem with given id was not found")
		}
	}
	async getPopular() {
		return this.prisma.problem.findFirst({
			select: this.PROBLEM_GET_FIELDS_SELECT,
			orderBy: {
				likes: "desc"
			}
		})
	}

	async getPage({ pagination, filters, orderBy }: GetPageProblemsDto) {
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
	async getMaxPage({ filters, pagination }: GetPageProblemsDto) {
		const pageCount = await this.prisma.problem.count({ where: filters })
		return Math.floor(pageCount / pagination.pageSize)
	}

	async getNextProblemId(fromProblemId: number) {
		return this.prisma.problem.findFirst({
			where: { id: { gt: fromProblemId } },
			select: { id: true }
		})
	}
	async getPrevProblemId(fromProblemId: number) {
		return this.prisma.problem.findFirst({
			where: { id: { lt: fromProblemId } },
			select: { id: true }
		})
	}
	async getRandomProblemId() {
		const problemCount = await this.prisma.problem.count()
		const skip = Math.floor(Math.random() * problemCount)
		return this.prisma.problem.findFirst({
			skip,
			select: { id: true },
			orderBy: { id: "asc" }
		})
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
				tags: [
					createProblemDto.difficulty.toUpperCase(),
					...createProblemDto.tags
				],
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
		const testsOptions =
			updateProblemDto.testsOptions as unknown as Prisma.JsonObject
		const functionOptions =
			updateProblemDto.functionOptions as unknown as Prisma.JsonObject
		const solution = updateProblemDto.solution
			? updateProblemDto.solution.replaceAll("\\n", "\n")
			: undefined
		if (solution) {
			try {
				eval(solution)
			} catch (e) {
				throw new BadRequestException(e.message)
			}
		}
		try {
			return await this.prisma.problem.update({
				where: { id: problemId },
				data: {
					...updateProblemDto,
					testsOptions,
					functionOptions
				},
				select: this.PROBLEM_GET_FIELDS_SELECT
			})
		} catch {
			throw new BadRequestException(
				"Problem with given id was not found, or else.."
			)
		}
	}

	async updateUserProblems(opts: {
		problemId: number
		userId: string
		isSuccess: boolean
	}) {
		return this.prisma.user.update({
			where: { id: opts.userId },
			data: {
				problems: {
					connect: { id: opts.problemId }
				},
				solvedProblems: opts.isSuccess
					? {
							connect: { id: opts.problemId }
						}
					: undefined
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

		// @ts-expect-error checking if data have .tests, if so assign it to customTests value
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

	async like(problemId: number, userId: string, undo = false) {
		try {
			const isUserLiked = !!(await this.prisma.user.findUnique({
				where: { id: userId, likedProblems: { some: { id: problemId } } }
			}))

			// if user is not liked and he wants to undo it - dont do anything
			// if user is liked and he wants to undo it - decrement
			// if user is not liked and he wants to like it - increment
			// otherwise - dont do anything
			const increment =
				!isUserLiked && undo
					? 0
					: isUserLiked && undo
						? -1
						: !isUserLiked && !undo
							? 1
							: 0
			const response = await this.prisma.problem.update({
				where: {
					id: problemId
				},
				select: { likes: true, usersDisliked: true, usersLiked: true },
				data: {
					likes: {
						increment
					},
					usersDisliked: {
						disconnect: {
							id: userId
						}
					},
					usersLiked: {
						[undo ? "disconnect" : "connect"]: {
							id: userId
						}
					}
				}
			})
			return response.likes
		} catch {
			throw new BadRequestException("Problem with given id was not found.")
		}
	}
	async dislike(problemId: number, userId: string, undo = false) {
		try {
			const isUserDisliked = !!(await this.prisma.user.findUnique({
				where: { id: userId, dislikedProblems: { some: { id: problemId } } }
			}))
			// if user is not disliked and he wants to undo it - dont do anything
			// if user is disliked and he wants to undo it - increment
			// if user is not disliked and he wants to dislike it - decrement
			// otherwise - dont do anything
			const increment =
				!isUserDisliked && undo
					? 0
					: isUserDisliked && undo
						? 1
						: !isUserDisliked && !undo
							? -1
							: 0
			const response = await this.prisma.problem.update({
				where: {
					id: problemId
				},
				select: { likes: true },
				data: {
					likes: {
						increment
					},
					usersLiked: {
						disconnect: {
							id: userId
						}
					},
					usersDisliked: {
						[undo ? "disconnect" : "connect"]: {
							id: userId
						}
					}
				}
			})
			return response.likes
		} catch {
			throw new BadRequestException("Problem with given id was not found.")
		}
	}
}
