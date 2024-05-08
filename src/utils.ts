import { CHARACTERS } from "@/constants"
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
			return new Array<number>(0).map(() => randomNumber(0, 1000))
		case "string-array":
			return new Array<string>(0).map(() => randomString(randomNumber(5, 40)))
		default:
			throw new BadRequestException("Invalid type: " + type)
	}
}

export const equalsCheck = (a: any, b: any) => {
	return JSON.stringify(a) === JSON.stringify(b)
}
