"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { VoteType } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import useCustomToasts from "@/hooks/use-custom-toast";
import { toast } from "../ui/use-toast";
import { usePrevious } from "@mantine/hooks";
import { PostVoteRequest } from "@/lib/validators/vote";
import Icons from "../Icons";

const PostVoteClient = ({
  initialVotesAmt,
  initialVote,
  postId,
}: {
  postId: string;
  initialVotesAmt: number;
  initialVote?: VoteType | null;
}) => {
  const loginToast = useCustomToasts();
  const [currentVote, setCurrentVote] = useState(initialVote);
  const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
  const prevVote = usePrevious(currentVote);

  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType: type,
      };
      const { data } = await axios.patch("/api/subthreadit/post/vote", payload);
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
        setCurrentVote(type);
        if (type === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        if (type === "DOWN")
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });
  return (
    <div className="flex sm:flex-col sm:w-14 max-sm:ml-4 items-center ">
      <Button
        variant={"ghost"}
        onClick={() => vote("UP")}
        size="sm"
        aria-label="upvote"
      >
        
        <Icons.heart
          className={`text-gray-500 w-6 h-6${
            currentVote === "UP" && " fill-[#D6536D] text-rose-800"
          }`}
        />
      </Button>
      <p className="text-center text-zinc-900 px-1 py-1 sm:text-base text-sm font-medium ">
        {votesAmt}
      </p>
      <Button
        variant={"ghost"}
        onClick={() => vote("DOWN")}
        size="sm"
        aria-label="downvote"
      >
        <Icons.heart
          className={`text-gray-500 scale-y-[-1] w-6 h-6 ${
            currentVote === "DOWN" &&
            " fill-[#F2CB74] text-[#F2CB74]"
          }`}
        />
      </Button>
    </div>
  );
};

export default PostVoteClient;
