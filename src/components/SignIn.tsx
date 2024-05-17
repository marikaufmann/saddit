import Image from "next/image";
import React from "react";
import UserAuthForm from "./UserAuthForm";
import Link from "next/link";

const SignIn = () => {
  return (
    <div className="mx-auto sm:w-[400px] w-full flex flex-col justify-center items-center gap-y-4 z-10">
      <div className="space-y-2  text-center">
        <div className="relative h-full w-32 mx-auto">
          <img alt="logo" src="/logo.png" className="rounded-sm " />
        </div>

        <h1 className=" font-semibold text-2xl -tracking-tight font-title">
          Welcome back
        </h1>
        <p className="text-sm max-w-xs">
          By continuing, you agree to our User Agreement and acknowledge that
          you understand the Privacy Policy.
        </p>
      </div>
      <div className="gap-y-2 flex flex-col w-full">
        <UserAuthForm />
        <p className="text-sm text-muted-foreground text-center">
          New to Threadit?{" "}
          <Link
            className="underline underline-offset-4 hover:text-zinc-900"
            href="/sign-up"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
