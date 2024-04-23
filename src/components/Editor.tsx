"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import TextareaAutosize from "react-textarea-autosize";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "./ui/use-toast";
import { usePathname, useRouter } from "next/navigation";
import { uploadFiles } from "@/lib/uploadthing";
import type EditorJS from "@editorjs/editorjs";

import "@/styles/editor.css";

const Editor = ({ subsadditId }: { subsadditId: string }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<PostCreationRequest>({
    defaultValues: {
      title: "",
      content: null,
      subsadditId,
    },
    resolver: zodResolver(PostValidator),
  });
  if (Object.keys(errors).length) {
    for (const [_key, value] of Object.entries(errors)) {
      toast({
        title: "Something went wrong.",
        description: value.message as string,
        variant: "destructive",
      });
    }
  }
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLAreaElement>(null);
  const { ref: titleRef, ...rest } = register("title");
  const [isMounted, setIsMounted] = useState(false);

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], "imageUploader");
                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
        },
      });
    }
  }, []);
  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subsadditId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = { title, content, subsadditId };
      const { data } = await axios.post("/api/subsaddit/post/create", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 403) {
          return toast({
            title: "You must be a member in order to post.",
            description: "Please join in and try again.",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Something went wrong.",
        description: "Your post was not published. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      const newPathName = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathName);
      router.refresh();
      toast({
        description: "Your post has been successfully published.",
        variant: "default",
      });
    },
  });
  const onSubmit = async (data: PostCreationRequest) => {
    const blocks = await ref.current?.save();
    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subsadditId,
    };
    createPost(payload);
  };
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);
  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0);
    };
    if (isMounted) {
      init();
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);
  return (
    <div className="rounded-lg border border-zinc-200 bg-[#f7fcff] w-full p-4">
      <form
        id="subsaddit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}>
        <TextareaAutosize
          className="w-full resize-none overflow-hidden appearance-none bg-transparent text-5xl font-bold focus:outline-none"
          placeholder="Title"
          ref={(e) => {
            titleRef(e);
            // @ts-ignore
            _titleRef.current = e;
          }}
          {...rest}
        />
        <div id="editor" className="min-h-[500px]" />
        <p className="text-gray-500 text-sm">
          Use{" "}
          <kbd className="uppercase border bg-muted rounded-md px-1 text-xs">
            Tab
          </kbd>{" "}
          to open the command menu.
        </p>
      </form>
    </div>
  );
};

export default Editor;
