import React from "react";
import CreateComment from "./CreateComment";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import UserAvatar from "../UserAvatar";
import PostComment from "./PostComment";

const CommentSection = async ({ postId }: { postId: string }) => {
  const session = await getAuthSession();

  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
          replyTo: {
            include: {
              author: true,
            },
          },
        },
      },
    },
  });
  return (
    <div className="flex flex-col gap-y-4 ">
      <hr className="w-full h-px mt-4 mb-1" />
      <CreateComment postId={postId} />
      <div className="flex flex-col gap-y-6 ">
        {comments.map((comment) => {
          const votesAmt = comment.votes.reduce((acc, vote) => {
            if (vote.type === "UP") return acc + 1;
            if (vote.type === "DOWN") return acc - 1;
            return acc;
          }, 0);
          const currentVote = comment.votes.find(
            (vote) => vote.userId === session?.user.id,
          );
          return (
            <div key={comment.id} className="flex flex-col">
              <div className="">
                <PostComment
                  postId={postId}
                  comment={comment}
                  currentVote={currentVote}
                  votesAmt={votesAmt}
                />
              </div>
              {comment.replies
                .sort((a, b) => a.votes.length - b.votes.length)
                .map((reply) => {
                  const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                    if (vote.type === "UP") return acc + 1;
                    if (vote.type === "DOWN") return acc - 1;
                    return acc;
                  }, 0);
                  const replyVote = reply.votes.find(
                    (vote) => vote.userId === session?.user.id,
                  );
                  return (
                    <div
                      key={reply.id}
                      className="ml-6 pl-4 py-2 border-l border-zinc-200">
                      <PostComment
                        postId={postId}
                        replyToUsername={reply.replyTo?.author.username || undefined}
                        comment={reply}
                        currentVote={replyVote}
                        votesAmt={replyVotesAmt}
                      />
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CommentSection;
