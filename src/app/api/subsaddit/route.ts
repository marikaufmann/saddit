import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubsadditValidator } from '@/lib/validators/subsaddit'
import { z } from 'zod'
export  async function POST(req: Request) {
	try {
		const session = await getAuthSession()
		if (!session?.user) {
			return new Response('Unauthorized', { status: 401 })
		}
		const body = await req.json()
		const { name } = SubsadditValidator.parse(body)
		const subsadditExists = await db.subsaddit.findFirst({
			where: {
				name
			}
		})
		if (subsadditExists) {
			return new Response('Subsaddit already exists', { status: 409 })
		}
		const subsaddit = await db.subsaddit.create({
			data: {
				name,
				creatorId: session.user.id
			}
		})
		const subscription = await db.subscription.create({
			data: {
				subsadditId: subsaddit.id,
				userId: session.user.id
			}
		})
		return new Response(subsaddit.name)
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 422 })
		}
		return new Response('Could not create subsaddit', { status: 500 })
	}

}