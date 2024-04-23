import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import SearchBar from "./SearchBar";

const Navbar = async () => {
  const session = await getAuthSession();
  return (
    <div className="bg-[#cbe8f8] py-2 fixed inset-x-0 top-0 z-[10] border-b border-[#7ca2b7]">
      <div className="flex sm:gap-6 gap-3 justify-between items-center md:container sm:px-4 px-2 max-w-7xl mx-auto">
        <a href="/" className="flex gap-2 items-center">
          <div className="relative h-10 w-10 md:h-8 md:w-8">
            <Image fill alt="logo" src="/logo.png" className="rounded-sm" />
          </div>
          <p className="font-logo font-semibold md:block hidden text-lg">
            saddit
          </p>
        </a>
        <SearchBar />
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link
            href="/sign-in"
            className={buttonVariants({
              className: "rounded-full max-w-[80px] w-full",
            })}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
