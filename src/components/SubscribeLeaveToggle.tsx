"use client";
import { Subsaddit } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import React, { startTransition } from "react";
import { Button } from "./ui/Button";
import { toast } from "./ui/use-toast";
import { SubscribeToSubsadditPayload } from "@/lib/validators/subsaddit";
import useCustomToasts from "@/hooks/use-custom-toast";
import { useRouter } from "next/navigation";

const SubscribeLeaveToggle = ({
  subsaddit,
  isSubscribed,
	props
}: {
  subsaddit: Subsaddit;
  isSubscribed: boolean;
	props?: string
}) => {
  const router = useRouter();
  const loginToast = useCustomToasts();
  const { mutate: subscribe, isLoading: isSubscribeLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubsadditPayload = {
        subsadditId: subsaddit.id,
      };
      const { data } = await axios.post("/api/subsaddit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "There was a problem.",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      toast({
        title: "Subscribed!",
        description: `You are now subscribed to s/${subsaddit.name}`,
        variant: "default",
      });
    },
  });
  const { mutate: unsubscribe, isLoading: isUnsubscribeLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubsadditPayload = {
        subsadditId: subsaddit.id,
      };
      const { data } = await axios.post("/api/subsaddit/unsubscribe", payload);
      return data as string;
    },
    onError: (err: AxiosError) => {
      return toast({
        title: "There was an error.",
        description: err.response?.data as string,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      toast({
        title: "Unsubscribed!",
        description: `You are no longer a member of s/${subsaddit.name}`,
        variant: "default",
      });
    },
  });
  return (
    <>
      {!isSubscribed ? (
        <Button
          isLoading={isSubscribeLoading}
          className={`px-10 ${props}`}
          variant="outline"
          onClick={() => subscribe()}>
          Join
        </Button>
      ) : (
        <Button
          isLoading={isUnsubscribeLoading}
          className={`px-10 ${props}`}
          variant="outline"
          onClick={() => unsubscribe()}>
          Leave
        </Button>
      )}
    </>
  );
};

export default SubscribeLeaveToggle;
