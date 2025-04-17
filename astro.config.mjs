// @ts-check
import { defineConfig, envField } from "astro/config";

import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      BETTER_AUTH_URL: envField.string({
        context: "client",
        access: "public",
      }),
      BETTER_AUTH_SECRET: envField.string({
        context: "server",
        access: "secret",
      }),
      DATABASE_URL: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
  prefetch: true,
  adapter: node({
    mode: "standalone",
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
