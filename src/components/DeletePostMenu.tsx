"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { MoreHorizontal } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { DeletePostRequest } from "@/lib/validators/post";
import useCustomToasts from "@/hooks/use-custom-toast";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";

const DeletePostMenu = ({ postId }: { postId: string }) => {
  const loginToast = useCustomToasts();
  const router = useRouter();
  const pathname = usePathname();
  const { mutate: deletePost } = useMutation({
    mutationFn: async ({ postId }: DeletePostRequest) => {
      const payload: DeletePostRequest = {
        postId,
      };
      const { data } = await axios.patch(
        "/api/subthreadit/post/delete",
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
        description: "Could not delete your post. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      const newPathName = pathname.split("/").slice(0, -2).join("/");
      router.push(newPathName);
      return toast({
        title: "Your post has been deleted successfully.",
        variant: "default",
      });
    },
  });
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <MoreHorizontal className="h-4 w-4 text-gray-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-fit" align="end">
        <DropdownMenuItem
          onClick={() => deletePost({ postId })}
          className="text-xs text-zinc-900 cursor-pointer"
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DeletePostMenu;
