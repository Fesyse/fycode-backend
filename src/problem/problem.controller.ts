import {
	Controller,
	Post,
	Body,
	Patch,
	Param,
	UsePipes,
	ValidationPipe,
	Delete,
	Get
} from "@nestjs/common"
import { ProblemService } from "./problem.service"
import { CreateProblemDto } from "./dto/create-problem.dto"
import { UpdateProblemDto } from "./dto/update-problem.dto"
import { Auth } from "@/auth/decorators/auth.decorator"
import { CurrentUser } from "@/auth/decorators/user.decorator"
import { AttemptProblemDto } from "./dto/attempt-problem.dto"
import { SubmitProblemDto } from "./dto/submit-problem.dto"
import { GetSomeProblemsDto } from "./dto/get-some-problem.dto"
@Controller("problem")
export class ProblemController {
	constructor(private readonly problemService: ProblemService) {}

	@Get("/:id")
	get(
		@CurrentUser("id") userId: string | undefined,
		@Param("id") problemId: string
	) {
		if (problemId === "popular") {
			return this.problemService.getPopular(userId)
		} else {
			return this.problemService.getById(+problemId, userId)
		}
	}

	@Post("get/some")
	@UsePipes(new ValidationPipe())
	async getSome(@Body() getSomeProblemsDto: GetSomeProblemsDto) {
		const problems = await this.problemService.getSome(getSomeProblemsDto)
		const maxPage = await this.problemService.getMaxPage(getSomeProblemsDto)

		return { problems, maxPage }
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
		@Param("id") problemId: string
	) {
		return this.problemService.like(+problemId, userId)
	}

	@Auth()
	@Post("dislike/:id")
	async dislike(
		@CurrentUser("id") userId: string,
		@Param("id") problemId: string
	) {
		return this.problemService.dislike(+problemId, userId)
	}
}
