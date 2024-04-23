import React from "react";
import { User } from "next-auth";
import { Avatar, AvatarFallback } from "./ui/Avatar";
import Image from "next/image";
import Icons from "./Icons";
import { AvatarProps } from "@radix-ui/react-avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">;
}
const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="h-full w-full relative aspect-square">
          <Image
            src={user.image}
            fill
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
          <Icons.user className="w-6 h-6" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
