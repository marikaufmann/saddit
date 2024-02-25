import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import React from "react";
import PostFeed from "../PostFeed";

const GeneralFeed = async () => {
  const posts = await db.post.findMany({
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
  return <PostFeed initialPosts={posts}/>
};

export default GeneralFeed;
