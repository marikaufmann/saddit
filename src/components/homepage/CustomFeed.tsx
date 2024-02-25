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
      subsaddit: true,
    },
  });
  const customPosts = await db.post.findMany({
    where: {
      subsadditId: {
        in: followedCommunities.map((community) => community.subsaddit.id),
      },
    },
    include: {
      author: true,
      subsaddit: true,
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
      subsaddit: true,
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
