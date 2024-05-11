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

	@Auth()
	@Get("get/some")
	@UsePipes(new ValidationPipe())
	getSome(@Body() getSomeProblemsDto: GetSomeProblemsDto) {
		return this.problemService.getSome(getSomeProblemsDto)
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
	attempt(
		@Param("id") problemId: string,
		@CurrentUser("id") userId: string,
		@Body() attemptProblemDto: AttemptProblemDto
	) {
		return this.problemService.test({
			problemId: +problemId,
			userId,
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
			userId,
			testProblemDto: submitProblemDto
		})
		if (testsResult.success)
			await this.problemService.updateUserSolvedProblems(+problemId, userId)
		return testsResult
	}
}
