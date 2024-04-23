import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { DeleteSubsadditValidator } from "@/lib/validators/subsaddit"
import { z } from "zod"

export async function PATCH(req: Request) {
	try {
		const session = await getAuthSession()
		if (!session?.user) return new Response('Unauthorized', { status: 401 })
		const body = await req.json()
		const { name } = DeleteSubsadditValidator.parse(body)
		console.log(name);

		await db.subsaddit.delete({
			where: {
				name
			}
		})

		return new Response('OK')
	} catch (err) {
		if (err instanceof z.ZodError) {
			return new Response(err.message, { status: 400 })
		}

		return new Response(
			'Could not delete a subsaddit. Please try later',
			{ status: 500 }
		)
	}

}