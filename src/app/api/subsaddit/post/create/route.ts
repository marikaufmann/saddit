import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { PostValidator } from "@/lib/validators/post"
import { ZodError, z } from "zod"

export async function POST(req: Request) {
	try {

		const session = await getAuthSession()
		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 })
		}

		const body = await req.json()
		const { title, content, subsadditId } = PostValidator.parse(body)

		const subsaddit = await db.subsaddit.findFirst({
			where: {
				id: subsadditId
			}
		})
		if (!subsaddit) {
			return new Response('Subsaddit does not exist', { status: 400 })
		}
		const isSubscribed = await db.subscription.findFirst({
			where: {
				userId: session.user.id,
				subsadditId
			}
		})
		if (!isSubscribed) {
			return new Response('Subscribe to create a post', { status: 403 })
		}
		await db.post.create({
			data: {
				title,
				content,
				authorId: session.user.id,
				subsadditId
			}
		})
		return new Response(subsadditId)
	} catch (err) {
		if (err instanceof ZodError) {
			return new Response('Invalid data was passed', { status: 400 })
		}
		return new Response('Could not create post at this time, please try again.', { status: 500 })
	}
}