import DeletePostMenu from "@/components/DeletePostMenu";
import EditorOutput from "@/components/EditorOutput";
import CommentSection from "@/components/comments/CommentSection";
import PostVoteServer from "@/components/post-vote/PostVoteServer";
import { Button } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatTimeToNow } from "@/lib/utils";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown } from "lucide-react";
import { ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
const page = async ({ params: { postId } }: { params: { postId: string } }) => {
  const session = await getAuthSession();
  const cachedPost: CachedPost | null = await redis.hgetall(`post:${postId}`);
  let post: (Post & { votes: Vote[]; author: User }) | null = null;
  if (!cachedPost) {
    post = await db.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });
  }
  if (!cachedPost && !post) return notFound();

  return (
    <div className="rounded-md shadow overflow-hidden bg-[#f7fcff]">
      <div className="flex flex-col sm:flex-row py-2 max-sm:pl-4">
        <div className="max-sm:order-last max-sm:py-1">
          <Suspense fallback={<PostVotesFallback />}>
            {/* @ts-expect-error Server Component */}
            <PostVoteServer
              getData={async () =>
                await db.post.findUnique({
                  where: {
                    id: postId,
                  },
                  include: {
                    votes: true,
                  },
                })
              }
              postId={postId}
            />
          </Suspense>
        </div>

        <div className="flex-1 py-2 pr-4">
          <div className="flex items-center justify-between ">
            <p className="text-gray-500 text-xs">
              Posted by {cachedPost?.authorUsername ?? post?.author.username}
              <span>
                {" "}
                <span className=" text-gray-500">·</span>{" "}
                {formatTimeToNow(
                  new Date(cachedPost?.createdAt! ?? post?.createdAt!),
                )}
              </span>
            </p>
            {(cachedPost?.authorId ?? post?.author.id) === session?.user.id && (
              <DeletePostMenu postId={postId}/>
            )}
          </div>
          <h1 className="font-semibold text-lg text-gray-900 py-2 leading-6">
            {cachedPost?.title ?? post?.title}
          </h1>
          <EditorOutput content={cachedPost?.content ?? post?.content} />
        </div>
      </div>

      <div className="p-4 sm:pl-14">
        <Suspense
          fallback={<Loader2 className="h-5 w-5 animate-spin text-zinc-500" />}>
          {/* @ts-expect-error Server Component */}
          <CommentSection postId={cachedPost?.id ?? post?.id} />
        </Suspense>
      </div>
    </div>
  );
};
const PostVotesFallback = () => {
  return (
    <div className="flex md:flex-col md:w-14  items-center">
      <Button variant={"ghost"} size="sm" aria-label="upvote">
        <ArrowBigUp className={`text-zinc-700 w-6 h-6 `} />
      </Button>
      <Loader2 className=" w-4 h-4 text-center text-zinc-900 md:text-base text-sm font-medium animate-spin md:mb-1 md:mt-1" />
      <Button variant={"ghost"} size="sm" aria-label="downvote">
        <ArrowBigDown className={`text-zinc-700  w-6 h-6 `} />
      </Button>
    </div>
  );
};
export default page;
