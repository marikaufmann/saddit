import { ExtendedPost } from "@/types/db";
import React, { useRef } from "react";
import PostVoteClient from "./post-vote/PostVoteClient";
import { VoteType } from "@prisma/client";
import { formatTimeToNow } from "@/lib/utils";
import EditorOutput from "./EditorOutput";
import { MessageSquare } from "lucide-react";
interface PostProps {
  currentVote: VoteType | null;
  votesAmt: number;
  commentsAmt: number;
  post: ExtendedPost;
  subsadditName: string | null;
}
const Post = ({
  currentVote,
  votesAmt,
  commentsAmt,
  post,
  subsadditName,
}: PostProps) => {
  const pRef = useRef<HTMLParagraphElement>(null);
  return (
    <div className=" rounded-md shadow overflow-hidden">
      <div className=" bg-[#f7fcff] flex justify-between max-sm:py-2 max-sm:px-6">
        <div className="sm:block hidden">
          <PostVoteClient
            postId={post.id}
            initialVote={currentVote}
            initialVotesAmt={votesAmt}
          />
        </div>
        <div className="flex-1 ">
          <div className="max-h-40">
            {!subsadditName ? (
              <>
                <a
                  className="text-xs font-semibold text-gray-700 underline underline-offset-2"
                  href={`/s/${post.subsaddit.name}`}>
                  s/{post.subsaddit.name}
                </a>{" "}
                <span className=" text-gray-500">·</span>{" "}
              </>
            ) : null}
            <span className="text-xs text-gray-500">
              Posted by u/{post.author.username}
              {"  "}
              {formatTimeToNow(new Date(post.createdAt))}
            </span>
          </div>
          <a href={`/s/${post.subsaddit.name}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
						
            <div className="max-h-52 overflow-clip text-sm relative pr-4" ref={pRef}>
              <EditorOutput content={post.content} />
              {pRef.current?.clientHeight === 208 ? (
                <div className="absolute bottom-0 left-0 h-24 bg-gradient-to-t from-white to-transparent w-full" />
              ) : null}
            </div>
          </a>
        </div>
      </div>
      <div className="bg-transparent flex items-center sm:py-2 py-1 ">
        <div className="sm:hidden ">
          <PostVoteClient
            postId={post.id}
            initialVote={currentVote}
            initialVotesAmt={votesAmt}
          />
        </div>
        <div className="px-4 font-medium text-zinc-700 flex text-sm items-center gap-2 sm:px-14">
          <MessageSquare className="h-4 w-4" />
          {commentsAmt} comments
        </div>
      </div>
    </div>
  );
};

export default Post;
