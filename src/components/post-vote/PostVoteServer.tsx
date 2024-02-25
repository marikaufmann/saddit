import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Post, Vote } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import PostVoteClient from "./PostVoteClient";

const PostVoteServer = async ({
  getData,
  postId,
}: {
  getData: () => Promise<(Post & { votes: Vote[] }) | null>;
  postId: string;
}) => {
  const session = await getAuthSession();
  const post = await getData();
  if (!post) return notFound();
  const votesAmt = post.votes.reduce((acc, vote: Vote) => {
    if (vote.type === "UP") return acc + 1;
    if (vote.type === "DOWN") return acc - 1;
    return acc;
  }, 0);

  const initialVote = post.votes.find(
    (vote) => vote.userId === session?.user.id,
  )?.type;

  return <PostVoteClient postId={postId} initialVotesAmt={votesAmt} initialVote={initialVote || null}/>;
};

export default PostVoteServer;
