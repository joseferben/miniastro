/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Import the component and dependencies
import { AppPage } from "./page";
import { Toaster } from "@/components/ui/sonner";

// --- Mocks ---

// Mock astro:actions with basic resolved promises
vi.mock("astro:actions", async () => {
  const actual = await vi.importActual("astro:actions");
  return {
    ...actual, // Use actual structure if needed, otherwise define manually
    actions: {
      getNrOfHearts: {
        orThrow: vi.fn().mockResolvedValue(0), // Return 0 hearts by default
      },
      addHeart: {
        orThrow: vi.fn().mockResolvedValue(undefined), // Resolve successfully
      },
    },
  };
});

// Mock authClient from @/lib/auth-client
vi.mock("@/lib/auth-client", () => ({
  authClient: {
    getSession: vi.fn().mockResolvedValue({
      success: true,
      data: { user: { email: "test@example.com" } }, // Provide mock user data
    }),
  },
}));

// --- Test Setup ---

// Helper function to create a fresh QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    // logger option removed due to type conflict with astro check
    defaultOptions: {
      queries: {
        retry: false, // Turn off retries for testing
        // Set staleTime to Infinity to prevent immediate refetches in tests
        // if you don't want to wait for background updates.
        // staleTime: Infinity,
      },
    },
  });

// Helper function to render the component with QueryClientProvider and Toaster
function renderWithClient(client: QueryClient, ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={client}>
      {ui}
      <Toaster /> {/* Include Toaster as it's part of PageContext */}
    </QueryClientProvider>
  );
}

// --- Tests ---

describe("AppPage Component", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    // Mock window.matchMedia specifically for this test suite
    // This ensures it's available before the component renders
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Create a new QueryClient for each test to ensure isolation
    queryClient = createTestQueryClient();
    // Reset mocks if needed (though basic mocks might not need resetting)
    vi.clearAllMocks(); // Use clearAllMocks for safety
  });

  it("renders without crashing", async () => {
    // Render the component using the helper
    renderWithClient(queryClient, <AppPage />);

    // Check if a key element (like the main heading) is present
    // This confirms the component rendered without throwing an error during initial render or effect execution.
    // findByRole waits for async operations like the initial queries to settle
    expect(
      await screen.findByRole("heading", { name: /miniastro/i })
    ).toBeInTheDocument();

    // You could add more basic checks here if needed, e.g.,
    // expect(await screen.findByText("test@example.com")).toBeInTheDocument();
    // expect(await screen.findByText("0")).toBeInTheDocument(); // Based on default mock
  });

  // Add more simple tests here if needed, but avoid complex interactions for now.
});
