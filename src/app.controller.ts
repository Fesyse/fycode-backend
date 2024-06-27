import { Controller, Get } from "@nestjs/common"

@Controller()
export class AppController {
	@Get()
	lifetimeCheck() {
		return "Server is working correctly."
	}
}
