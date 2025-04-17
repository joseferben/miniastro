import { queryClient, persister } from "@/lib/react-query-client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Toaster } from "@/components/ui/sonner";

export function PageContext({ children }: { children: React.ReactNode }) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={() =>
        console.log("restored react-query client from local storage")
      }
    >
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
      {children}
    </PersistQueryClientProvider>
  );
}
