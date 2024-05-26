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
		if (problemId === "popular") {
			return this.problemService.getPopular(query.userId)
		} else {
			return this.problemService.getById(+problemId, query.userId)
		}
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

	@Post("attempt/:id")
	@UsePipes(new ValidationPipe())
	attempt(
		@Param("id") problemId: string,
		@Body() attemptProblemDto: AttemptProblemDto
	) {
		return this.problemService.test({
			problemId: +problemId,
			testProblemDto: attemptProblemDto
		})
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
		if (testsResult.success)
			await this.problemService.updateUserSolvedProblems(+problemId, userId)
		return testsResult
	}

	@Auth()
	@Post("like/:id")
	async like(
		@CurrentUser("id") userId: string,
		@Param("id") problemId: string,
		@Query() query: { undo?: string }
	) {
		return this.problemService.like(+problemId, userId, query.undo === "false")
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
			query.undo === "false"
		)
	}
}
