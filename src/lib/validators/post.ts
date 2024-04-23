import { z } from "zod";

export const PostValidator = z.object({
	title: z.string().min(3, { message: 'Title must be at least 3 characters long' }).max(128, { message: 'Title must be 128 characters long max' }),
	content: z.any(),
	subsadditId: z.string()
})
export const DeletePostValidator = z.object({
	postId: z.string()
})
export type PostCreationRequest = z.infer<typeof PostValidator>

export type DeletePostRequest = z.infer<typeof DeletePostValidator>