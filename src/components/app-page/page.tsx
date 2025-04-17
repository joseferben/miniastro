import { PageContext } from "@/context/page-context";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { actions } from "astro:actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Loader2, Book } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

const cuteMessages = [
  "💖 You're awesome!",
  "✨ Spread the love!",
  "😊 Sending virtual hugs!",
  "🌟 You brightened my day!",
  "💕 Keep being amazing!",
  "🥳 Love received!",
  "🥰 Heartfelt thanks!",
  "🌈 You rock!",
  "🎉 Yay, more love!",
  "💌 Sending good vibes!",
];

type AnimatingHeart = {
  id: number;
  left: number;
};

function AppPage_() {
  const queryClient = useQueryClient();
  const [animatingHearts, setAnimatingHearts] = useState<AnimatingHeart[]>([]);

  const nrOfHearts = useQuery({
    queryKey: ["nr-of-hearts"],
    queryFn: () => actions.getNrOfHearts.orThrow(),
  });

  const session = useQuery({
    queryKey: ["session"],
    queryFn: () => authClient.getSession(),
  });

  const addHeart = useMutation({
    mutationFn: () => actions.addHeart.orThrow(),
    onError: (error) => {
      console.error("Failed to add heart:", error);
      toast.error("Failed to add heart. Please try again.");
    },
    onSuccess: () => {
      console.log("Heart added successfully.");
      const randomIndex = Math.floor(Math.random() * cuteMessages.length);
      toast.success(cuteMessages[randomIndex]);
      queryClient.invalidateQueries({ queryKey: ["nr-of-hearts"] });
    },
  });

  const handleAddHeartClick = () => {
    addHeart.mutate();

    const newHeart: AnimatingHeart = {
      id: Date.now(),
      left: Math.random() * 40 - 20,
    };
    setAnimatingHearts((prev) => [...prev, newHeart]);
  };

  const handleAnimationEnd = (id: number) => {
    setAnimatingHearts((prev) => prev.filter((heart) => heart.id !== id));
   console.log(`Removed animating heart ${id}`);
 };

 return (
   <div className="relative container mx-auto max-w-lg px-4 flex flex-col min-h-screen justify-center">
     <div className="relative z-10 flex flex-col items-center">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">miniastro</h1>
          {/* Container to prevent CLS for email */}
          <div className="h-6 min-w-[12rem] flex items-center justify-center mx-auto">
            {session.isLoading ? (
              <Skeleton className="h-5 w-full" />
            ) : (
              <p className="text-xl text-muted-foreground truncate">
                {session.data?.data?.user?.email}
              </p>
            )}
          </div>
        </header>
        <div className="relative flex justify-center gap-4 mb-12">
          <div className="absolute inset-0 z-20 flex justify-center pointer-events-none">
            {animatingHearts.map((heart) => (
              <Heart
                key={heart.id}
                className="animate-fly-heart absolute text-red-500"
                style={{
                  left: `calc(75% + ${heart.left}px)`,
                  bottom: "5px",
                }}
                fill="currentColor"
                size={24}
                onAnimationEnd={() => handleAnimationEnd(heart.id)}
              />
            ))}
          </div>
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

          {/* Updated onClick handler */}
          <Button
            variant="outline"
            onClick={handleAddHeartClick}
            disabled={addHeart.isPending}
            className="bg-white/80 hover:bg-white/90 hover:scale-105 transition-all text-black font-medium flex items-center hover:cursor-pointer"
            aria-label="Add a heart"
          >
            {addHeart.isPending ? (
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Heart
                className="mr-2 h-4 w-4 text-red-500"
                fill="currentColor"
              />
            )}
            Love
          </Button>
        </div>
        {/* Heart Display Section */}
        <div className="flex justify-center items-center gap-2 text-lg mt-8">
          <Heart
            className={cn(
              "h-6 w-6 text-red-500 transition-transform duration-300 ease-in-out",
              addHeart.isPending && "animate-pulse"
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
  );
}

export function AppPage() {
  return (
    <PageContext>
      <AppPage_ />
    </PageContext>
  );
}
