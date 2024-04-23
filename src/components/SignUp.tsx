import Image from "next/image";
import React from "react";
import UserAuthForm from "./UserAuthForm";
import Link from "next/link";

const SignIn = () => {
  return (
    <div className="mx-auto sm:w-[400px] w-full flex flex-col justify-center items-center gap-y-4 ">
      <div className="space-y-2  text-center">
        <div className="relative h-12 w-12 mx-auto">
          <Image fill alt="logo" src="/logo.png" className="rounded-sm" />
        </div>
        <h1 className=" font-semibold text-2xl tracking-tight font-title">
          Sign Up
        </h1>
        <p className="text-sm max-w-xs">
          By continuing, you agree to our User Agreement and acknowledge that
          you understand the Privacy Policy.
        </p>
      </div>
      <div className="gap-y-2 flex flex-col w-full">
        <UserAuthForm />
        <p className="text-sm text-muted-foreground text-center">
          Already a sadditor?{" "}
          <Link
            className="underline underline-offset-4 hover:text-zinc-900"
            href="/sign-in">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
