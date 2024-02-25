"use client";
import { Subsaddit } from "@prisma/client";
import { format } from "date-fns";
import { Session } from "next-auth";
import Link from "next/link";
import React, { useState } from "react";
import { buttonVariants } from "./ui/Button";
import { AlignJustify, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SubscribeLeaveToggle from "./SubscribeLeaveToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import { MoreHorizontal } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { DeleteSubsadditRequest } from "@/lib/validators/subsaddit";
import { toast } from "./ui/use-toast";

const About = ({
  slug,
  subsaddit,
  memberCount,
  isSubscribed,
  session,
}: {
  session: Session | null;
  slug: string;
  subsaddit: Subsaddit;
  memberCount: number;
  isSubscribed: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();
  const [isSubmitPage] = pathname.split("/").slice(-1);
  const router = useRouter();
  const { mutate: deleteSubsaddit } = useMutation({
    mutationFn: async () => {
      const payload: DeleteSubsadditRequest = {
        name: subsaddit.name,
      };
      const { data } = await axios.patch("/api/subsaddit/delete", payload);
      return data;
    },
    onError: (err) => {
      return toast({
        title: "Something went wrong.",
        description: "Could not delete your subsaddit. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.push("/");
      return toast({
        title: `Subsaddit ${subsaddit.name} has been deleted successfully.`,
        variant: "default",
      });
    },
  });
  return (
    <>
      <div className="rounded-lg border border-gray-200 md:block md:order-last hidden overflow-hidden h-fit">
        <div className="py-4 px-6">
          <div className="flex items-center justify-between">
            <p className="py-3 font-semibold font-title">
              About <a className="hover:text-[#015281]" href={`/s/${slug}`}>s/{slug}</a>{" "}
            </p>
            {subsaddit.creatorId === session?.user.id && (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit" align="end">
                  <DropdownMenuItem
                    onClick={() => deleteSubsaddit()}
                    className="text-xs text-zinc-900 cursor-pointer">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        <dl className="bg-[#f7fcff] py-4 px-6 text-sm divide-y divide-gray-100 leading-6">
          <div className="flex justify-between py-3 ">
            <dt className="text-gray-700">Created</dt>
            <dd>{format(subsaddit.createdAt, "MMMM d, yyyy")}</dd>
          </div>
          <div className="flex justify-between py-3 ">
            <dt className="text-gray-700">Members</dt>
            <dd>{memberCount}</dd>
          </div>
          {subsaddit.creatorId === session?.user.id ? (
            <dt className="py-3 text-gray-500">You created this comminity</dt>
          ) : null}
          <Link
            href={`/s/${slug}/submit`}
            className={buttonVariants({ className: "w-full mb-2" })}>
            Create Post
          </Link>
          {subsaddit.creatorId !== session?.user.id
            ? isSubmitPage === "submit" && (
                <SubscribeLeaveToggle
                  isSubscribed={isSubscribed}
                  subsaddit={subsaddit}
                  props="w-full"
                />
              )
            : null}
        </dl>
      </div>
      <div className="md:hidden order-first">
        {isOpen ? (
          <div className="rounded-lg border border-gray-200 ">
            <div className="py-4 px-6 relative">
              <div className="flex items-center gap-10">
                <p className="py-3 font-semibold font-title">About s/{slug}</p>
                {subsaddit.creatorId === session?.user?.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal className="h-4 w-4 text-gray-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-fit" align="end">
                      <DropdownMenuItem
                        onClick={() => deleteSubsaddit()}
                        className="text-xs text-zinc-900 cursor-pointer">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <div
                onClick={() => setIsOpen(false)}
                className={buttonVariants({
                  className: "absolute cursor-pointer top-2 right-2",
                  variant: "ghost",
                })}>
                <X className="w-4 h-4" />
              </div>
            </div>
            <dl className="bg-[#f7fcff] py-4 px-6 text-sm divide-y divide-gray-100 leading-6">
              <div className="flex justify-between py-3 ">
                <dt className="text-gray-700">Created</dt>
                <dd>{format(subsaddit.createdAt, "MMMM d, yyyy")}</dd>
              </div>
              <div className="flex justify-between py-3 ">
                <dt className="text-gray-700">Members</dt>
                <dd>{memberCount}</dd>
              </div>
              {subsaddit.creatorId === session?.user.id ? (
                <dt className="py-3 text-gray-500">
                  You created this comminity
                </dt>
              ) : null}
              <Link
                href={`/s/${slug}/submit`}
                className={buttonVariants({ className: "w-full mb-2" })}>
                Create Post
              </Link>
              {subsaddit.creatorId !== session?.user.id
                ? isSubmitPage === "submit" && (
                    <SubscribeLeaveToggle
                      isSubscribed={isSubscribed}
                      subsaddit={subsaddit}
                      props="w-full"
                    />
                  )
                : null}
            </dl>
          </div>
        ) : (
          <div className="flex justify-end -mt-6">
            <div
              className={buttonVariants({
                variant: "ghost",
                className: "cursor-pointer",
              })}
              onClick={() => setIsOpen(true)}>
              <AlignJustify />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default About;
