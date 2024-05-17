"use client";
import React, { useState } from "react";
import { Textarea } from "../ui/TextArea";
import { Button } from "../ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import useCustomToasts from "@/hooks/use-custom-toast";
import { toast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { CreateCommentRequest } from "@/lib/validators/comment";
import { Label } from "../ui/Label";

const CreateComment = ({
  postId,
  replyToId,
}: {
  postId: string;
  replyToId?: string;
}) => {
  const [input, setInput] = useState<string>("");
  const loginToast = useCustomToasts();
  const router = useRouter();

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CreateCommentRequest) => {
      const payload: CreateCommentRequest = {
        text,
        postId,
        replyToId,
      };
      const { data } = await axios.patch(
        "/api/subthreadit/post/comment",
        payload
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
      setInput("");
      router.refresh();
    },
  });
  return (
    <div className="flex flex-col gap-2">
      <Textarea
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="What are your thoughts?"
        className="resize-none rounded-full mt-2"
      />
      <div className="justify-end flex ">
        <Button
          isLoading={isLoading}
          disabled={input.length === 0}
          onClick={() => comment({ postId, text: input, replyToId })}
        >
          Comment
        </Button>
      </div>
    </div>
  );
};

export default CreateComment;
