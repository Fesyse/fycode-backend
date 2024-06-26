import {
	registerDecorator,
	type ValidationArguments,
	type ValidationOptions
} from "class-validator"

interface IsFileOptions {
	mime: ("image/jpg" | "image/png" | "image/jpeg")[]
}

export function IsFile(
	options: IsFileOptions,
	validationOptions?: ValidationOptions
) {
	return function (object: object, propertyName: string) {
		return registerDecorator({
			name: "isFile",
			target: object.constructor,
			propertyName: propertyName,
			constraints: [],
			options: validationOptions,
			validator: {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				validate(value: any, _args: ValidationArguments) {
					if (
						value?.mimetype &&
						(options?.mime ?? []).includes(value?.mimetype)
					) {
						return true
					}
					return false
				}
			}
		})
	}
}
