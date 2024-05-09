import { equalsCheck, getRandomArg } from "@/utils"
import {
	FunctionArg,
	FunctionOptions,
	TestsOptions
} from "./dto/create-problem.dto"
import type { CustomTest } from "./dto/attempt-problem.dto"

export interface Test {
	input: FunctionArg[]
	expected: any
	output: any
}

export interface TestsStatus {
	passed: number
	declined: number
}

interface TestArguments {
	userSolution: string
	solution: string
	testsOptions: TestsOptions
	functionOptions: FunctionOptions
	customTests?: CustomTest[]
	handleBadCodeRequest: (message: string) => never
}

export interface TestsResult {
	tests: Test[]
	testsStatus: TestsStatus
	success: boolean
}

type TestSolution = (options: TestArguments) => TestsResult

const getSolutionsTest = ({
	solution,
	userSolution,
	handleBadCodeRequest,
	functionOptions,
	mockArgs
}: Omit<TestArguments, "customTests" | "testsOptions"> & {
	mockArgs: any[]
}): Test => {
	try {
		const argsAsString = JSON.stringify(mockArgs)
		const functionCall = `${functionOptions.name}(${argsAsString.substring(1, argsAsString.length - 1)})`

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
	testsOptions,
	functionOptions,
	handleBadCodeRequest,
	customTests,
	userSolution,
	solution
}) => {
	const tests: Test[] = []
	if (!customTests) {
		for (let i = 0; i < testsOptions.totalChecks; i++) {
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
		customTests.map(customTest => {
			const test = getSolutionsTest({
				functionOptions,
				handleBadCodeRequest,
				mockArgs: customTest.input,
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
