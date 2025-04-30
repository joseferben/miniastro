import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as reactContainerRenderer } from "@astrojs/react";
import { expect, test } from "vitest";
import type { Session } from "better-auth";

import AppIndex from "@/pages/app/index.astro";
import type { User } from "@/schema";

test("App page renders when user is authenticated", async () => {
  const renderers = await loadRenderers([reactContainerRenderer()]);
  const container = await AstroContainer.create({ renderers });

  const mockUser: User = {
    id: "test-user-id",
    name: "Test User",
    email: "test@example.com",
    emailVerified: true,
    image: null,
    stripeCustomerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const mockSession: Session = {
    id: "test-session-id",
    expiresAt: new Date(Date.now() + 3600 * 1000), // Expires in 1 hour
    token: "test-token",
    createdAt: new Date(),
    updatedAt: new Date(),
    ipAddress: null,
    userAgent: null,
    userId: mockUser.id,
  };
  const mockLocals: App.Locals = {
    user: mockUser,
    session: mockSession,
  };

  const mockRequest = new Request("http://localhost:4321/app");

  const result = await container.renderToString(AppIndex, {
    locals: mockLocals,
    request: mockRequest,
  });

  // Basic assertion: Check if the rendered output contains the astro-island placeholder
  // for the client:only component. This confirms the page rendered and the component
  // is set up for client-side hydration.
  expect(result).toContain("<astro-island");
  expect(result).toContain('component-url="@/components/app-page/page"');
  expect(result).toContain('client="only"');

  // Note: We cannot assert the actual rendered content of AppPage (like "text-red-500")
  // using renderToString because it's client:only. End-to-end tests (Playwright/Cypress)
  // would be needed for that level of testing.
});

test("App page redirects when user is not authenticated", async () => {
  // Load necessary renderers
  const renderers = await loadRenderers([reactContainerRenderer()]);
  const container = await AstroContainer.create({ renderers });

  // Define mock locals without a session
  const mockLocals: App.Locals = {
    user: null,
    session: null,
  };

  // Define a mock request object
  const mockRequest = new Request("http://localhost:4321/app");

  // Render the component to a Response object to check for redirects
  const response = await container.renderToResponse(AppIndex, {
    locals: mockLocals,
    request: mockRequest,
  });

  // Assert that the response is a redirect (status 302)
  expect(response.status).toBe(302);
  // Assert that the redirect location is the home page ("/")
  expect(response.headers.get("location")).toBe("/");
});
