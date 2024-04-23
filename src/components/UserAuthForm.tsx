"use client";
import React, { useState } from "react";
import { Button } from "./ui/Button";
import Icons from "./Icons";
import { useToast } from "./ui/use-toast";
import { signIn } from "next-auth/react";
const UserAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was an error while trying to login with Google, please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      isLoading={isLoading}
      size="sm"
      disabled={isLoading}
      type="button"
      onClick={loginWithGoogle}
      className="w-full rounded-full font-semibold">
      <Icons.google className="h-4 w-4 mr-2" />
      Google
    </Button>
  );
};

export default UserAuthForm;
