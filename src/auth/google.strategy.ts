import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { User } from "@prisma/client"
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20"

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
	constructor() {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_SECRET,
			callbackURL: "http://localhost:4200/api/auth/google/redirect",
			scope: ["email", "profile"]
		})
	}
	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
		done: VerifyCallback
	): Promise<any> {
		console.log(accessToken)
		console.log(refreshToken)
		console.log(profile)
		const { id, displayName, photos, emails } = profile
		const user = {
			id,
			avatar: photos[0].value,
			email: emails[0].value,
			accessToken
		}
		done(null, user)
	}
}
