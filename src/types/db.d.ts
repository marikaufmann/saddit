import type { Post, Subsaddit, User, Vote, Comment } from '@prisma/client'
export type ExtendedPost =
	Post & {
		author: User;
		comments: Comment[];
		votes: Vote[];
		subsaddit: Subsaddit;
	}

