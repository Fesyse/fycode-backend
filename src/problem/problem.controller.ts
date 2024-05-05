import {
	Controller,
	Post,
	Body,
	Patch,
	Param,
	UsePipes,
	ValidationPipe,
	HttpCode
} from "@nestjs/common"
import { ProblemService } from "./problem.service"
import { CreateProblemDto } from "./dto/create-problem.dto"
import { UpdateProblemDto } from "./dto/update-problem.dto"
import { Auth } from "@/auth/decorators/auth.decorator"
import { CurrentUser } from "@/auth/decorators/user.decorator"
import { AttemptProblemDto } from "./dto/attempt-problem.dto"
import { SubmitProblemDto } from "./dto/submit-problem.dto"

@Controller("problem")
export class ProblemController {
	constructor(private readonly problemService: ProblemService) {}

	@Auth()
	@HttpCode(200)
	@Post("create")
	@UsePipes(new ValidationPipe())
	create(
		@CurrentUser("id") creatorId: string,
		@Body() createProblemDto: CreateProblemDto
	) {
		return this.problemService.create(creatorId, createProblemDto)
	}

	@Auth()
	@HttpCode(200)
	@Patch("update/:id")
	@UsePipes(new ValidationPipe())
	update(
		@Param("id") problemId: string,
		@Body() updateProblemDto: UpdateProblemDto
	) {
		return this.problemService.update(+problemId, updateProblemDto)
	}

	@Auth()
	@HttpCode(200)
	@Post("attempt/:id")
	@UsePipes(new ValidationPipe())
	attempt(
		@Param("id") problemId: string,
		@Body() testProblemDto: AttemptProblemDto
	) {
		return
	}

	@Auth()
	@HttpCode(200)
	@Post("submit/:id")
	@UsePipes(new ValidationPipe())
	submit(
		@Param("id") problemId: string,
		@Body() testProblemDto: SubmitProblemDto
	) {
		return
	}
}
