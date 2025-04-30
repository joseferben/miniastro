/// <reference path="../.astro/types.d.ts" />
/// <reference types="@testing-library/jest-dom/vitest" />
/// <reference types="vitest/globals" />

declare namespace App {
  // Note: 'import {} from ""' syntax does not work in .d.ts files.
  interface Locals {
    user: import("better-auth").User | null;
    session: import("better-auth").Session | null;
  }
}
