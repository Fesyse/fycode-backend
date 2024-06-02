import {
	Controller,
	Post,
	Body,
	Patch,
	Param,
	UsePipes,
	ValidationPipe,
	Delete,
	Get,
	Query
} from "@nestjs/common"
import { ProblemService } from "./problem.service"
import { CreateProblemDto } from "./dto/create-problem.dto"
import { UpdateProblemDto } from "./dto/update-problem.dto"
import { Auth } from "@/auth/decorators/auth.decorator"
import { CurrentUser } from "@/auth/decorators/user.decorator"
import { AttemptProblemDto } from "./dto/attempt-problem.dto"
import { SubmitProblemDto } from "./dto/submit-problem.dto"
import { GetPageProblemsDto } from "./dto/get-some-problem.dto"
@Controller("problem")
export class ProblemController {
	constructor(private readonly problemService: ProblemService) {}

	@Get("/:id")
	@UsePipes(new ValidationPipe())
	get(
		@Param("id") problemId: string,
		@Query() query: { userId: string | undefined }
	) {
		return this.problemService.getById(+problemId, query.userId)
	}

	@Post("get/page")
	@UsePipes(new ValidationPipe())
	async getPage(@Body() getPageProblemsDto: GetPageProblemsDto) {
		const problems = await this.problemService.getPage(getPageProblemsDto)
		const maxPage = await this.problemService.getMaxPage(getPageProblemsDto)

		return { problems, maxPage }
	}

	@Get("get/next")
	async getNextProblemId(@Query("fromProblemId") fromProblemId: string) {
		return this.problemService.getNextProblemId(+fromProblemId)
	}
	@Get("get/prev")
	async getPrevProblemId(@Query("fromProblemId") fromProblemId: string) {
		return this.problemService.getPrevProblemId(+fromProblemId)
	}
	@Get("get/random")
	async getRandomProblemId() {
		return this.problemService.getRandomProblemId()
	}

	@Auth()
	@Post("create")
	@UsePipes(new ValidationPipe())
	create(
		@CurrentUser("id") creatorId: string,
		@Body() createProblemDto: CreateProblemDto
	) {
		return this.problemService.create(creatorId, createProblemDto)
	}

	@Auth()
	@Patch("update/:id")
	@UsePipes(new ValidationPipe())
	update(
		@Param("id") problemId: string,
		@Body() updateProblemDto: UpdateProblemDto
	) {
		return this.problemService.update(+problemId, updateProblemDto)
	}

	@Auth()
	@Delete("delete/:id")
	delete(@Param("id") problemId: string, @CurrentUser("id") userId: string) {
		return this.problemService.delete(+problemId, userId)
	}

	@Auth()
	@Post("attempt/:id")
	@UsePipes(new ValidationPipe())
	async attempt(
		@Param("id") problemId: string,
		@Body() attemptProblemDto: AttemptProblemDto,
		@CurrentUser("id") userId: string
	) {
		const testsResult = await this.problemService.test({
			problemId: +problemId,
			testProblemDto: attemptProblemDto
		})

		await this.problemService.updateUserProblems({
			problemId: +problemId,
			userId,
			isSuccess: false
		})

		return testsResult
	}

	@Auth()
	@Post("submit/:id")
	@UsePipes(new ValidationPipe())
	async submit(
		@Param("id") problemId: string,
		@CurrentUser("id") userId: string,
		@Body() submitProblemDto: SubmitProblemDto
	) {
		const testsResult = await this.problemService.test({
			problemId: +problemId,
			testProblemDto: submitProblemDto
		})

		await this.problemService.updateUserProblems({
			problemId: +problemId,
			userId,
			isSuccess: testsResult.success
		})

		return testsResult
	}

	@Auth()
	@Post("like/:id")
	async like(
		@CurrentUser("id") userId: string,
		@Param("id") problemId: string,
		@Query() query: { undo?: string }
	) {
		return this.problemService.like(+problemId, userId, query.undo !== "false")
	}

	@Auth()
	@Post("dislike/:id")
	async dislike(
		@CurrentUser("id") userId: string,
		@Param("id") problemId: string,
		@Query() query: { undo?: string }
	) {
		return this.problemService.dislike(
			+problemId,
			userId,
			query.undo !== "false"
		)
	}
}
