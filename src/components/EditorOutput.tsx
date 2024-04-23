"use client";
import dynamic from "next/dynamic";
import React from "react";
import CustomImageRenderer from "./renderers/CustomImageRenderer";
import CustomCodeRenderer from "./renderers/CustomCodeRenderer";
const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  { ssr: false },
);
const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};
const style = {
  paragraph: {
    lineHeight: "1.25rem",
    fontSize: "0.875rem",
  },
};
const EditorOutput = ({ content }: { content: any }) => {
  return (
		
    <Output
      renderers={renderers}
      style={style}
      data={content}
      className="text-sm"
    />
  );
};

export default EditorOutput;
