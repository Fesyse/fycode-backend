import { NestFactory } from "@nestjs/core"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "@/app.module"
import * as cookieParser from "cookie-parser"

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.setGlobalPrefix("api")
	app.use(cookieParser())
	app.enableCors({
		origin: [process.env.CLIENT_URL],
		credentials: true,
		exposedHeaders: "set-cookie"
	})

	const config = new DocumentBuilder()
		.setTitle("Fycode")
		.setDescription("Fycode backend API documentation.")
		.setVersion("1.0")
		.addTag("auth")
		.addTag("user")
		.addTag("problem")
		.build()
	const document = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup("docs", app, document)

	await app.listen(4200)
}
bootstrap()
