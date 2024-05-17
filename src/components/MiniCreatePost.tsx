"use client";
import React, { useState } from "react";
import UserAvatar from "./UserAvatar";
import { Session } from "next-auth";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { ImageIcon, Link2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const MiniCreatePost = ({ session }: { session: Session | null }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <li className="bg-[#f2f1ef] rounded-md shadow flex justify-between items-center px-4 py-4 sm:px-6 sm:gap-6 gap-2 ">
      <div className="relative">
        <UserAvatar
          user={{
            image: session?.user.image || null,
            name: session?.user.name || null,
          }}
          className="text-zinc-600 max-sm:h-8 max-sm:w-8"
        />
        <div className="absolute rounded-full bg-[#FFA2B6] outline-[#f2f1ef] outline outline-2 bottom-0 right-0 w-3 h-3 max-sm:w-2 max-sm:h-2" />
      </div>
      <Input
        placeholder="Create post"
        readOnly
        onClick={() => router.push(pathname + "/submit")}
      />
      <div className="flex justify-between max-sm:-mr-4 max-sm:-ml-3 sm:-ml-2">
        <Button variant="ghost">
          <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-600 max-sm:-mr-4" />
        </Button>
        <Button variant="ghost">
          <Link2 className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-600" />
        </Button>
      </div>
    </li>
  );
};

export default MiniCreatePost;
