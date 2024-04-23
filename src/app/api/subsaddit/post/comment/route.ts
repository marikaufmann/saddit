import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { z } from "zod";

export async function PATCH(req: Request) {
	try {
		const session = await getAuthSession()

		if (!session?.user) { 
			return new Response('Unauthorized', { status: 401 })
		 }

		const body = await req.json()

		const { replyToId, postId, text } = CommentValidator.parse(body)
		console.log(text, postId);
		
		const post = await db.post.findFirst({
			where: {
				id: postId
			}
		})
		if (!post) return new Response('Post does not exist', { status: 400 })
		await db.comment.create({
			data: {
				text,
				authorId: session.user.id,
				postId,
				replyToId
			}
		})
		return new Response('OK')
	} catch (err) {
		if (err instanceof z.ZodError) {
			return new Response(err.message, { status: 400 })
		}

		return new Response(
			'Could not create a comment. Please try later',
			{ status: 500 }
		)
	}

}