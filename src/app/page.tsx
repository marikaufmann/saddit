import CustomFeed from "@/components/homepage/CustomFeed";
import GeneralFeed from "@/components/homepage/GeneralFeed";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function Home() {
  const session = await getAuthSession();
  return (
    <>
      <h1 className="font-title text-3xl font-bold md:text-4xl">Your feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* @ts-expect-error Server Component */}
        {session?.user ? <CustomFeed /> : <GeneralFeed />}
        <div className="rounded-lg h-fit border border-[#7ca2b7] order-first md:order-last overflow-hidden">
          <div className="bg-[#6cc4d8] py-4 px-6 flex items-center">
            <p className="py-3 flex gap-1.5 font-semibold items-center font-title">
              <HomeIcon className="h-4 w-4" />
              Home
            </p>
          </div>
          <dl className="py-4 px-6 divide-y divide-gray-100 bg-[#f7fcff] -my-3">
            <p className="py-3 text-sm leading-6 font-title">
              Your personal Saddit frontpage. Come here to check in with your
              favorite depressive communities.
            </p>
            <Link
              className={buttonVariants({
                className: "w-full mt-4 mb-6 rounded-full font-semibold",
              })}
              href="/s/create">
              Create Community
            </Link>
          </dl>
        </div>
      </div>
    </>
  );
}
