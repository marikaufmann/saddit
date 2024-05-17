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
    <div className="bg-[#ffc9d4] py-2 fixed inset-x-0 top-0 z-20 border-b border-[#FFA2B6]">
      <div className="flex sm:gap-6 gap-3 justify-between items-center md:container sm:px-4 px-2 max-w-7xl mx-auto">
        <a href="/" className=" ">
          <div className="relative h-full w-36 ">
            <img alt="logo" src="/logo-navbar.png" className="rounded-sm " />
          </div>
        </a>
        <SearchBar />
        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link
            href="/sign-in"
            className={buttonVariants({
              className: "rounded-full max-w-[80px] w-full",
            })}
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
