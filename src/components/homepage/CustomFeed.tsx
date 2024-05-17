import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import React from "react";
import PostFeed from "../PostFeed";
import { getAuthSession } from "@/lib/auth";
import { notFound } from "next/navigation";

const CustomFeed = async () => {
  const session = await getAuthSession();
  if (!session) return notFound();
  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subthreadit: true,
    },
  });
  const customPosts = await db.post.findMany({
    where: {
      subthreaditId: {
        in: followedCommunities.map((community) => community.subthreadit.id),
      },
    },
    include: {
      author: true,
      subthreadit: true,
      comments: true,
      votes: true,
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
    orderBy: {
      createdAt: "desc",
    },
  });
  const genPosts = await db.post.findMany({
    include: {
      author: true,
      subthreadit: true,
      comments: true,
      votes: true,
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <PostFeed initialPosts={customPosts.length > 0 ? customPosts : genPosts} />
  );
};

export default CustomFeed;
