"use client";
import React from "react";
import { Button } from "./ui/Button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

const CloseModal = () => {
  const router = useRouter();
  return (
    <Button
      variant="subtle"
      onClick={() => router.back()}
      className="rounded-full h-6 w-6 p-0 bg-[#cbe8f8]">
      <X className="w-4 h-4" aria-label="close modal" />
    </Button>
  );
};

export default CloseModal;
