import { CHARACTERS, CODE_SECURITY_MATCHES } from "@/constants"
import type { TestInputTypes } from "@/types"
import { BadRequestException } from "@nestjs/common"

export const randomNumber = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min

export const randomString = (length: number) => {
	let string = ""
	for (let i = 0; i < length; i++) {
		const rnum = Math.floor(Math.random() * CHARACTERS.length)
		string += CHARACTERS.substring(rnum, rnum + 1)
	}
	return string
}

export const getRandomArg = (type: TestInputTypes) => {
	switch (type) {
		case "number":
			return randomNumber(0, 1000)
		case "string":
			return randomString(randomNumber(5, 40))
		case "number-array":
			const numArr = new Array<number>(randomNumber(1, 15))
			for (let i = 0; i < numArr.length; i++) {
				numArr[i] = randomNumber(0, 1000)
			}
			return numArr
		case "string-array":
			const strArr = new Array<string>(randomNumber(1, 15))
			for (let i = 0; i < strArr.length; i++) {
				strArr[i] = randomString(randomNumber(5, 40))
			}
			return strArr
		default:
			throw new BadRequestException("Invalid type: " + type)
	}
}

export const equalsCheck = (a: any, b: any) => {
	return JSON.stringify(a) === JSON.stringify(b)
}

export const codeSecurityCheck = (code: string) => {
	for (let i = 0; i < CODE_SECURITY_MATCHES.length; i++) {
		const match = CODE_SECURITY_MATCHES[i]
		if (code.includes(match)) return false
	}

	return true
}
