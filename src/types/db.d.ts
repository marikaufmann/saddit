import type { Post, Subthreadit, User, Vote, Comment } from "@prisma/client";
export type ExtendedPost = Post & {
  author: User;
  comments: Comment[];
  votes: Vote[];
  subthreadit: Subthreadit;
};
