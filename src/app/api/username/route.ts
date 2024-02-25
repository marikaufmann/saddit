import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { z } from "zod";

export async function PATCH(req: Request) {
	try {
		const session = await getAuthSession()
		if (!session?.user) {
			return new Response('Unauthorized', { status: 401 })
		}
		const body = await req.json()
		const { username } = UsernameValidator.parse(body)
		const usernameExists = await db.user.findFirst({
			where: {
				username
			}
		})
		if (usernameExists) return new Response('Username already exists', { status: 409 })
		await db.user.update({
			where: {
				id: session.user.id
			},
			data: {
				username
			}
		})
		return new Response('OK')
	} catch (err) { 
		if (err instanceof z.ZodError) {
			return new Response(err.message, { status: 400 })
		}

		return new Response(
			'Could not update username at this time. Please try later',
			{ status: 500 }
		)
	}
}