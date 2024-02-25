"use client";
import { CommentVote as Vote, VoteType } from "@prisma/client";
import React, { useState } from "react";
import { Button } from "../ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { CommentVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";
import useCustomToasts from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
const CommentVote = ({
  initialVote,
  initialVotesAmt,
  commentId,
}: {
  initialVote?: Vote;
  initialVotesAmt: number;
  commentId: string;
}) => {
  const router = useRouter();
  const loginToast = useCustomToasts();
  const [currentVote, setCurrentVote] = useState<VoteType | undefined>(
    initialVote?.type,
  );
  const [votesAmt, setVotesAmt] = useState(initialVotesAmt);
  const prevVote = usePrevious(currentVote);

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: CommentVoteRequest = {
        voteType: type,
        commentId,
      };
      const { data } = await axios.patch(
        "/api/subsaddit/post/comment/vote",
        payload,
      );
      return data;
    },
    onError: (err, voteType) => {
      if (voteType === "UP") {
        if (voteType === prevVote) {
          setVotesAmt((prev) => prev + 1);
        } else if (prevVote) {
          setVotesAmt((prev) => prev - 2);
        } else {
          setVotesAmt((prev) => prev - 1);
        }
      }
      if (voteType === "DOWN") {
        if (voteType === prevVote) {
          setVotesAmt((prev) => prev - 1);
        } else if (prevVote) {
          setVotesAmt((prev) => prev + 2);
        } else {
          setVotesAmt((prev) => prev + 1);
        }
      }
      setCurrentVote(prevVote);
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "Something went wrong.",
        description: "Your vote was not registered. Please try again.",
        variant: "destructive",
      });
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        setCurrentVote(undefined);
        if (type === "UP") setVotesAmt((prev) => prev - 1);
        if (type === "DOWN") setVotesAmt((prev) => prev + 1);
      } else {
				setCurrentVote(type)
        if (type === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        if (type === "DOWN")
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });
  return (
    <div className="flex items-center ">
      <Button
        variant={"ghost"}
				aria-label="upvote"
        size="xs"
        onClick={() => vote("UP")}
        className="">
        <ArrowBigUp
          className={`h-5 w-5 text-gray-500 ${
            currentVote === "UP" && " fill-sky-300"
          }`}
        />
      </Button>
      <span className="text-sm text-center font-medium text-zinc-900">
        {votesAmt}
      </span>
				
      <Button   size="xs" aria-label="downvote" variant={"ghost"} onClick={() => vote("DOWN")}>
        <ArrowBigDown
          className={`h-5 w-5 text-gray-500  ${
            currentVote === "DOWN" && " fill-indigo-900 "
          }`}
        />
      </Button>
    </div>
  );
};

export default CommentVote;
