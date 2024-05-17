import About from "@/components/About";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

const Layout = async ({
  children,
  params: { slug },
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  const session = await getAuthSession();
  const subthreadit = await db.subthreadit.findFirst({
    where: {
      name: slug,
    },
  });
  if (!subthreadit) return notFound();
  const subscription = !session?.user
    ? undefined
    : await db.subscription.findFirst({
        where: {
          subthreadit: {
            name: slug,
          },
          userId: session?.user.id,
        },
      });
  const memberCount = await db.subscription.count({
    where: {
      subthreadit: {
        name: slug,
      },
    },
  });
  const isSubscribed = !!subscription;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4">
      <ul className="col-span-2 space-y-6 z-10">{children}</ul>
        <About
          session={session}
          slug={slug}
          subthreadit={subthreadit}
          isSubscribed={isSubscribed}
          memberCount={memberCount}
        />
    </div>
  );
};

export default Layout;
