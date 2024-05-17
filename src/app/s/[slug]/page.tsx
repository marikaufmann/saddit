import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
import SubscribeLeaveToggle from "@/components/SubscribeLeaveToggle";
import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, useRouter } from "next/navigation";
import React from "react";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = async ({
  params: { slug },
}: {
  params: {
    slug: string;
  };
}) => {
  const session = await getAuthSession();
  const subthreadit = await db.subthreadit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subthreadit: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  });
  if (!subthreadit) return notFound();
  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subthreaditId: subthreadit?.id,
          userId: session?.user.id,
        },
      });
  const isSubscribed = !!subscription;
  return (
    <>
      <li className="flex flex-col gap-2">
        <div className="flex justify-between">
          <h1 className="font-title font-semibold text-3xl">
            {slug.slice(0, 1).toUpperCase() + slug.slice(1)}
          </h1>
          {subthreadit?.creatorId !== session?.user.id ? (
            <SubscribeLeaveToggle
              subthreadit={subthreadit!}
              isSubscribed={isSubscribed}
            />
          ) : null}
        </div>
        <h3 className="text-gray-500 text-sm font-title">s/{slug}</h3>
      </li>
      <MiniCreatePost session={session} />
      {subthreadit.posts.length > 0 ? (
        <PostFeed
          initialPosts={subthreadit.posts}
          subthreaditName={subthreadit.name}
        />
      ) : (
        <div className="text-center mt-6">
          <h1 className="text-2xl font-semibold font-title">
            This community doesn't have any posts yet
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            Make one and get this feed started.
          </p>
        </div>
      )}
    </>
  );
};

export default page;
