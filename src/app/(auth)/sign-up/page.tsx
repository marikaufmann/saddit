import SignUp from "@/components/SignUp";
import { buttonVariants } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="max-w-2xl m-auto gap-20 flex flex-col">
      <Link
        href="/"
        className={`${buttonVariants({
          variant: "ghost",
        })} flex items-center font-title self-start`}>
        <ChevronLeft className="w-4 h-4 mr-2" /> Home
      </Link>
			<SignUp/>
    </div>
  );
};

export default page;
