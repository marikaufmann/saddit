import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { SubsadditSubscriptionValidator } from "@/lib/validators/subsaddit"
import { ZodError } from "zod"

export async function POST(req: Request) {
	try {
		const session = await getAuthSession()
		if (!session?.user) {
			return new Response('Unauthorized', { status: 401 })
		}
		const body = await req.json()
		const { subsadditId } = SubsadditSubscriptionValidator.parse(body)
		const subsadditExists = await db.subsaddit.findFirst({
			where: {
				id: subsadditId
			}
		})
		if (!subsadditExists) { return new Response('Subsaddit does not exist', { status: 400 }) }
		const subscriptionExsists = await db.subscription.findFirst({
			where: {
				subsadditId,
				userId: session.user.id
			}
		})
		if (!subscriptionExsists) { return new Response("You're not a member of this subsaddit, yet.", { status: 400 }) }
		await db.subscription.delete({
			where: {
				userId_subsadditId: {
					subsadditId,
					userId: session.user.id
				}
			}
		})
		return new Response(subsadditId)
	} catch (err) {
		if (err instanceof ZodError) {
			return new Response(err.message, { status: 400 })
		}
		return new Response('Could not unsubscribe at this time. Please try again later.', { status: 500 })
	}
} 