import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { DeleteCommentValidator } from "@/lib/validators/comment"
import { z } from "zod"

export async function PATCH(req: Request) {
	try {
		const session = await getAuthSession()
		if (!session?.user) return new Response('Unauthorized', { status: 401 })
		const body = await req.json()
		const { commentId } = DeleteCommentValidator.parse(body)
		await db.comment.delete({
			where: {
				id: commentId
			}
		})
		await db.comment.deleteMany({
			where: {
				replyToId: commentId
			}
		})

		return new Response('OK')
	} catch (err) {
		if (err instanceof z.ZodError) {
			return new Response(err.message, { status: 400 })
		}

		return new Response(
			'Could not delete a comment. Please try later',
			{ status: 500 }
		)
	}

}