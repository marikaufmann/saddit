import UserSettingsForm from "@/components/UserSettingsForm";
import { authOptions, getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";
export const metadata = {
  title: "Settings",
  description: "Magane account settings",
};
const page = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    redirect(authOptions?.pages?.signIn || "/sign-in");
  }
  return (
    <div className="py-12 max-w-4xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold md:text-4xl font-title">Settings</h1>
      <div>
        <UserSettingsForm
          user={{
            username: session?.user?.username || "",
            id: session.user.id,
          }}
        />
      </div>
    </div>
  );
};

export default page;
