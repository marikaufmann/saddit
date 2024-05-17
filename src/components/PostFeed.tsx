"use client";
import React, { useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/types/db";
import axios from "axios";
import Post from "./Post";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

const PostFeed = ({
  initialPosts,
  subthreaditName,
}: {
  initialPosts: ExtendedPost[];
  subthreaditName?: string;
}) => {
  const { data: session } = useSession();
  const lastPostRef = useRef(null);
  const { entry, ref } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
        (subthreaditName ? `&subthreaditName=${subthreaditName}` : "");
      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  );
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);
  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;
  return (
    <ul className="flex flex-col space-y-6 col-span-2 z-10">
      {posts.map((post, index) => {
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;
          return acc;
        }, 0);
        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );
        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                currentVote={currentVote?.type || null}
                votesAmt={votesAmt}
                commentsAmt={post.comments.length}
                post={post}
                subthreaditName={subthreaditName || null}
              />
            </li>
          );
        } else {
          return (
            <li key={post.id}>
              <Post
                currentVote={currentVote?.type || null}
                votesAmt={votesAmt}
                commentsAmt={post.comments.length}
                post={post}
                subthreaditName={subthreaditName || null}
              />
            </li>
          );
        }
      })}
      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#FFA2B6]" />
        </li>
      )}
    </ul>
  );
};

export default PostFeed;
