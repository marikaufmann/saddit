import Editor from "@/components/Editor";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { notFound } from "next/navigation";
import React from "react";

const page = async ({ params: { slug } }: { params: { slug: string } }) => {
  const subsaddit = await db.subsaddit.findFirst({
    where: {
      name: slug,
    },
  });
  if (!subsaddit) return notFound();
  return (
    <div className="flex flex-col gap-6 items-start">
      <div className="border-b border-gray-200  pb-5 flex flex-wrap items-baseline">
        <h1 className="font-semibold  text-base ">Create post</h1>
        <p className="text-sm text-gray-500 ml-2 truncate">in r/{slug}</p>
      </div>
      <Editor subsadditId={subsaddit.id} />
      <Button className="w-full" type="submit" form="subsaddit-post-form">
        Post
      </Button>
    </div>
  );
};

export default page;
