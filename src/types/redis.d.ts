import { VoteType } from "@prisma/client"

export type CachedPost = {
	id: string,
	authorUsername: string,
	authorId: string,
	title: string,
	content: string,
	createdAt: Date,
	currentVote: VoteType | null
}