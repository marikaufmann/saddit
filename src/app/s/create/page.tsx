"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "@/components/ui/use-toast";
import useCustomToasts from "@/hooks/use-custom-toast";
import { Textarea } from "@/components/ui/TextArea";
const page = () => {
  const loginToast = useCustomToasts();
  const [input, setInput] = useState("");
  const router = useRouter();
  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload = {
        name: input,
      };
      const { data } = await axios.post("/api/subsaddit", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Subsaddit with this name already exists.",
            description: "Please choose a different name.",
            variant: "destructive",
          });
        }
        if (err.response?.status === 422) {
          return toast({
            title: "Invalid subsaddit name.",
            description: "Please choose a name between 3 and 21 characters.",
            variant: "destructive",
          });
        }
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "There was an error.",
        description: "Could not create subsaddit, please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      router.push(`/s/${data}`);
			router.refresh()
      return toast({
        description: `Subsaddit "${data}" was successfully created!`,
        variant: "default",
      });
    },
  });
  return (
    <div className="rounded-lg max-w-3xl mx-auto shadow-sm overflow-hidden">
      <div className="bg-[#f7fcff] px-6 py-4 flex flex-col space-y-4 font-title">
        <h3 className=" font-semibold text-lg">Create a community</h3>
        <hr className="h-px" />
        <div className="font-medium">
          <h3 className="text-lg">Name</h3>
          <p className="text-xs text-zinc-400 pb-2">
            Community names including capitalization cannot be changed.
          </p>
          <div className="relative mt-4">
            <p className="absolute flex justify-center items-center w-8 inset-y-0 text-zinc-400 text-sm">
              s/
            </p>
            <Input value={input} onChange={(e) => setInput(e.target.value)} className="pl-6"/>
          </div>
        </div>
      </div>
      <div className="bg-slate-100 px-6 py-4 ">
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            onClick={() => createCommunity()}
            disabled={isLoading || input.length < 3}>
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

export default page;
