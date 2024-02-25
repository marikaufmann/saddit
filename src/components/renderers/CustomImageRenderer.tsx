import Image from "next/image";
import React from "react";

const CustomImageRenderer = ({ data }: any) => {
  const src = data.file.url;

  return (
    <div className="min-h-[30rem] sm:min-h-[36rem] w-full relative  ">
      <Image fill src={src} alt="image" className="object-contain object-left-top" />
    </div>
  );
};

export default CustomImageRenderer;
