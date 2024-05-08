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

interface TestOptions {
	userSolution: string
	solution: string
	functionOptions: FunctionOptions
	attemptTests?: AttemptTest[]
	handleBadCodeRequest: (message: string) => never
}

export interface TestsResult {
	tests: Test[]
	testsStatus: TestsStatus
	success: boolean
}

type TestSolution = (options: TestOptions) => TestsResult

const getSolutionsTest = ({
	solution,
	userSolution,
	handleBadCodeRequest,
	functionOptions,
	mockArgs
}: Omit<TestOptions, "attemptTests"> & { mockArgs: any[] }): Test => {
	try {
		const functionCall = `${functionOptions.name}(${mockArgs.join(", ")})`
		const expected = eval(`${solution}\n\n${functionCall}`)
		const output = eval(`${userSolution}\n\n${functionCall}`)
		return {
			input: mockArgs,
			expected,
			output
		}
	} catch (e) {
		handleBadCodeRequest(e.message)
	}
}

export const testSolution: TestSolution = ({
	functionOptions,
	handleBadCodeRequest,
	attemptTests,
	userSolution,
	solution
}) => {
	const tests: Test[] = []
	if (!attemptTests) {
		for (let i = 0; i < functionOptions.totalChecks; i++) {
			const mockArgs = []
			functionOptions.args.map(arg => {
				mockArgs.push(getRandomArg(arg.type))
			})

			const test = getSolutionsTest({
				userSolution,
				solution,
				handleBadCodeRequest,
				functionOptions,
				mockArgs
			})
			tests.push(test)
		}
	} else {
		attemptTests.map(attemptTest => {
			const test = getSolutionsTest({
				functionOptions,
				handleBadCodeRequest,
				mockArgs: attemptTest.input,
				solution,
				userSolution
			})
			tests.push(test)
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
