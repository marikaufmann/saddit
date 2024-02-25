import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { DeletePostValidator } from "@/lib/validators/post"
import { z } from "zod"

export async function PATCH(req: Request) {
	try {
		const session = await getAuthSession()
		if (!session?.user) return new Response('Unauthorized', { status: 401 })
		const body = await req.json()
		const { postId } = DeletePostValidator.parse(body)
		await db.post.delete({
			where: {
				id: postId
			}
		})

		return new Response('OK')
	} catch (err) {
		if (err instanceof z.ZodError) {
			return new Response(err.message, { status: 400 })
		}

		return new Response(
			'Could not delete a post. Please try later',
			{ status: 500 }
		)
	}

}