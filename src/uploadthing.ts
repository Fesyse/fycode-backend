import { UTApi } from "uploadthing/server"
import { createUploadthing, type FileRouter } from "uploadthing/express"

const f = createUploadthing()
export const utapi = new UTApi()

export const fileUploadRouter: FileRouter = {
	imageUploader: f({
		image: {
			maxFileSize: "4MB",
			maxFileCount: 1
		}
	}).onUploadComplete(async data => {
		console.log(data.metadata)
	})
}

export type FileUploadRouter = typeof fileUploadRouter
