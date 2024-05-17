"use client";
import { User } from "@prisma/client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  UsernameChangeRequest,
  UsernameValidator,
} from "@/lib/validators/username";
import axios, { AxiosError } from "axios";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";

const UserSettingsForm = ({
  user,
}: {
  user: Pick<User, "username" | "id">;
}) => {
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.username || "",
    },
    resolver: zodResolver(UsernameValidator),
  });
  const { mutate: changeUsername, isLoading } = useMutation({
    mutationFn: async ({ username }: UsernameChangeRequest) => {
      const payload: UsernameChangeRequest = {
        username,
      };
      const { data } = await axios.patch("/api/username", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "User with this username already exists.",
            description: "Please choose a another username.",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Something went wrong.",
        description: "Your username was not updated. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      toast({
        description: "Your username has been updated successfully.",
        variant: "default",
      });
      router.refresh();
    },
  });
  return (
    <form onSubmit={handleSubmit((e) => changeUsername(e))} className="z-10">
      <Card className="bg-[#f2f1ef]">
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please choose a display name you are comfortable with.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative flex items-center gap-1">
            <div className="absolute w-8 flex justify-center items-center top-0 left-0 h-10">
              <span className="text-muted-foreground text-sm">u/</span>
            </div>
            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <div className="flex flex-col gap-1">
              <Input
                className="w-[400px] pl-6"
                size={32}
                {...register("username")}
                id="name"
              />
              {errors?.username && (
                <p className="text-xs text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading}>Change name</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserSettingsForm;
