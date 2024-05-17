import CustomFeed from "@/components/homepage/CustomFeed";
import GeneralFeed from "@/components/homepage/GeneralFeed";
import { buttonVariants } from "@/components/ui/Button";
import { getAuthSession } from "@/lib/auth";
import Link from "next/link";
import Icons from "../components/Icons";

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
        <div className="rounded-lg h-fit border border-[#f2cc74] order-first md:order-last overflow-hidden z-10">
          <div className="bg-[#f2cc74] py-4 px-6 flex items-center">
            <p className="py-3 flex gap-1.5 font-semibold  font-title">
              <Icons.canister className="h-5 w-5 shrink-0" />
              Home
            </p>
          </div>
          <dl className="py-4 px-6 divide-y divide-gray-100 bg-[#f2f1ef] -my-3">
            <p className="py-3 text-sm leading-6 font-title">
              Your personal Threadit frontpage. Come here to check in with your
              favorite creative communities.
            </p>
            <Link
              className={buttonVariants({
                className: "w-full mt-4 mb-6 rounded-full font-semibold",
              })}
              href="/s/create"
            >
              Create Community
            </Link>
          </dl>
        </div>
      </div>
    </>
  );
}
