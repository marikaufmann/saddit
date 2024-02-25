"use client";
import React, { useEffect, useRef, useState } from "react";
import { CommentVote as Vote, User, Comment } from "@prisma/client";
import UserAvatar from "../UserAvatar";
import { formatTimeToNow } from "@/lib/utils";
import { useSession } from "next-auth/react";
import CommentVote from "./CommentVote";
import { MessageSquare, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/Button";
import { Textarea } from "../ui/TextArea";
import { useMutation } from "@tanstack/react-query";
import {
  CreateCommentRequest,
  DeleteCommentRequest,
} from "@/lib/validators/comment";
import axios, { AxiosError, isAxiosError } from "axios";
import { toast } from "../ui/use-toast";
import useCustomToasts from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
type ExtendedComment = Comment & {
  votes: Vote[];
  author: User;
};

const PostComment = ({
  comment,
  currentVote,
  votesAmt,
  postId,
  replyToUsername,
}: {
  comment: ExtendedComment;
  currentVote: Vote | undefined;
  votesAmt: number;
  postId: string;
  replyToUsername?: string;
}) => {
  const loginToast = useCustomToasts();
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [input, setInput] = useState("");
  const { mutate: deleteComment } = useMutation({
    mutationFn: async ({ commentId }: DeleteCommentRequest) => {
      const payload: DeleteCommentRequest = {
        commentId,
      };
      const { data } = await axios.patch(
        "/api/subsaddit/post/comment/delete",
        payload,
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "Something went wrong.",
        description: "Could not delete your comment. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      return toast({
        title: "Your comment has been deleted successfully.",
        variant: "default",
      });
    },
  });
  const { mutate: reply, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CreateCommentRequest) => {
      const payload: CreateCommentRequest = {
        postId,
        text,
        replyToId,
      };
      const { data } = await axios.patch(
        "/api/subsaddit/post/comment",
        payload,
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "Something went wrong.",
        description: "Could not create a comment. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsReplying(false);
    },
  });
  useOnClickOutside(commentRef, () => {
    setIsReplying(false);
  });
  return (
    <div ref={commentRef} className="flex flex-col ">
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2 ">
          <UserAvatar
            user={{
              name: comment.author.name || null,
              image: comment.author.image || null,
            }}
            className="w-6 h-6 "
          />
          <span className="text-gray-900 text-xs font-medium ">
            u/{comment.author.username}
          </span>{" "}
          <span className=" text-gray-500">·</span>{" "}
          <span className="text-gray-500 text-xs">
            {formatTimeToNow(new Date(comment.createdAt))}
          </span>
        </div>
        {comment.authorId === session?.user.id && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal className="h-3 w-3 text-gray-500" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit" align="end">
              <DropdownMenuItem
                onClick={() => deleteComment({ commentId: comment.id })}
                className="text-xs text-zinc-900 cursor-pointer">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <p className="text-sm mt-2 text-zinc-900 ml-8">
        {comment.replyToId ? (
          <span className="text-xs text-gray-700 mr-2 ">
            @{replyToUsername}
          </span>
        ) : null}

        {comment.text}
      </p>
      <div className="flex items-center ml-6">
        <CommentVote
          initialVote={currentVote || undefined}
          initialVotesAmt={votesAmt}
          commentId={comment.id}
        />
        <Button
          onClick={() => {
            if (!session) return router.push("/sign-in");
            setIsReplying(true);
          }}
          variant={"ghost"}
          className="text-gray-500 text-xs font-medium">
          <MessageSquare className="h-4 w-4 text-gray-500 mr-1.5 -ml-2" />
          <span className="">Reply</span>
        </Button>
      </div>
      {isReplying && (
        <div className="flex flex-col gap-2">
          <Textarea
            autoFocus
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What are your thoughts?"
            className="resize-none rounded-full mt-2"
          />
          <div className="justify-end flex gap-1.5">
            <Button
              variant={"subtle"}
              onClick={() => {
                setIsReplying(false);
              }}>
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              onClick={() => {
                if (!input) return;
                reply({
                  postId,
                  text: input,
                  replyToId: comment.replyToId ?? comment.id,
                });
              }}>
              Comment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComment;
