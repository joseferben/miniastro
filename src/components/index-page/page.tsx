import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Book, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { actions } from "astro:actions";
import { useQuery } from "@tanstack/react-query";
import { Particles } from "./particles";
import { PageContext } from "@/context/page-context";
import { SignInButton } from "./signin-button";

function _IndexPage() {
  const nrOfHearts = useQuery({
    queryKey: ["nr-of-hearts"],
    queryFn: () => actions.getNrOfHearts.orThrow(),
  });

  return (
    <div className="relative container mx-auto max-w-lg px-4 flex flex-col min-h-screen justify-center">
      <Particles />

      <div className="relative z-10 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <header className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">miniastro</h1>
            <p className="text-xl font-bold">
              Minimal Astro Starter optimized for AI
            </p>
          </header>
          <div className="flex justify-center gap-4 mb-12">
            <Button variant="outline" asChild>
              <a
                href="https://github.com/joseferben/miniastro"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:scale-105 transition-all"
              >
                <Book className="mr-2 h-4 w-4" />
                Docs
              </a>
            </Button>
            <SignInButton />
          </div>
          <div className="flex justify-center items-center gap-2 text-lg mt-8">
            <Heart
              className={cn(
                "h-6 w-6 text-red-500 transition-transform duration-300 ease-in-out"
              )}
              fill="currentColor"
            />
            <div className="h-6 min-w-[2rem] flex items-center justify-center">
              {nrOfHearts.isLoading || nrOfHearts.data === undefined ? (
                <Skeleton className="h-5 w-full" />
              ) : (
                <span>{nrOfHearts.data}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IndexPage() {
  return (
    <PageContext>
      <_IndexPage />
    </PageContext>
  );
}
