import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

const useCustomToasts = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login required.",
      description: "You need to be logged in to do that.",
      variant: "destructive",
      action: 
        <Link href="/sign-in" onClick={() => dismiss()}>
          Login
        </Link>
      
    });
  };

  return loginToast;
};

export default useCustomToasts;
