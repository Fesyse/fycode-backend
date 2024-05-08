import { equalsCheck, getRandomArg } from "@/utils"
import { FunctionArg, FunctionOptions } from "./dto/create-problem.dto"
import type { AttemptTest } from "./dto/attempt-problem.dto"

export interface Test {
	input: FunctionArg[]
	expected: any
	output: any
}

export interface TestsStatus {
	passed: number
	declined: number
}

export interface TestsResult {
	tests: Test[]
	testsStatus: TestsStatus
	success: boolean
}

type TestSolution = (options: {
	attemptTests?: AttemptTest[]
	functionOptions: FunctionOptions
}) => TestsResult

export const testSolution: TestSolution = ({
	functionOptions,
	attemptTests
}) => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const userFunc = require(`./user-solution`)
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const solutionFunc = require(`./solution`)
	const tests: Test[] = []
	if (!attemptTests) {
		for (let i = 0; i < functionOptions.totalChecks; i++) {
			const mockArgs = []
			functionOptions.args.map(arg => {
				mockArgs.push(getRandomArg(arg.type))
			})
			tests.push({
				input: mockArgs,
				expected: solutionFunc(...mockArgs),
				output: userFunc(...mockArgs)
			})
		}
	} else {
		attemptTests.map(test => {
			tests.push({
				input: test.input,
				expected: solutionFunc(...test.input),
				output: userFunc(...test.input)
			})
		})
	}

	const testsStatus: TestsStatus = {
		declined: tests.filter(test => !equalsCheck(test.expected, test.output))
			.length,
		passed: tests.filter(test => equalsCheck(test.expected, test.output)).length
	}
	const success = testsStatus.declined === 0

	return { tests, success, testsStatus }
}
