import CloseModal from "@/components/CloseModal";
import SignUp from "@/components/SignUp";
import React from "react";

const page = () => {
  return (
    <div className="inset-0 bg-zinc-900/20 z-10 fixed">
      <div className="container flex max-w-lg mx-auto h-full items-center">
        <div className="bg-[#f4fbff] h-fit w-full rounded-lg relative py-20 px-2">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default page;
