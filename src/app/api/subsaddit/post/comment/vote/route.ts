import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentVoteValidator } from "@/lib/validators/vote";
import { z } from "zod";

export async function PATCH(req: Request) {
	try {
		const session = await getAuthSession()
		if (!session?.user) return new Response('Unauthorized', { status: 401 })
		const body = await req.json()
		const { commentId, voteType } = CommentVoteValidator.parse(body)
		const voteExists = await db.commentVote.findFirst({
			where: {
				userId: session.user.id,
				commentId
			}
		})
		if (voteExists) {
			if (voteExists.type === voteType) {
				await db.commentVote.delete({
					where: {
						userId_commentId: {
							userId: session.user.id,
							commentId
						}
					}
				})
				return new Response('OK')
			} else {
				await db.commentVote.update({
					where: {
						userId_commentId: {
							userId: session.user.id,
							commentId
						}
					},
					data: {
						type: voteType
					}
				})
				return new Response('OK')
			}
		}
		await db.commentVote.create({
			data: {
				userId: session.user.id,
				commentId,
				type: voteType
			}
		})
		return new Response('OK')
	} catch (err) {
		if (err instanceof z.ZodError) {
			return new Response(err.message, { status: 400 })
		}

		return new Response(
			'Could not vote at this time. Please try later',
			{ status: 500 }
		)
	}

}