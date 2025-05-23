import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignInButton() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const signInWithGoogle = async () => {
    console.log("Attempting Google Sign-in...");
    try {
      setIsGoogleLoading(true);
      await authClient.signIn.social({
        callbackURL: "/app",
        errorCallbackURL: "/",
        provider: "google",
        fetchOptions: {
          onSuccess: () => {
            console.log("Signed in with Google. Redirecting to app...");
            toast.success("Signed in with Google. Redirecting to app...");
          },
          onError: (error) => {
            console.error("Error signing in with Google:", error);
            toast.error("Failed to sign in with Google. Please try again.");
          },
        },
      });
    } catch (err) {
      console.error("Google Sign-in error:", err);
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setIsGoogleLoading(false);
      console.log("Google Sign-in attempt finished.");
    }
  };

  return (
    <Button
      variant="outline"
      onClick={signInWithGoogle}
      disabled={isGoogleLoading}
      className="bg-white/80 hover:bg-white/90 hover:scale-105 transition-all text-black font-medium flex items-center hover:cursor-pointer"
      aria-label="Sign in with Google"
    >
      {isGoogleLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
      )}
      Sign in
    </Button>
  );
}
