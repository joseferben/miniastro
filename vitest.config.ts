import { resolve } from "path";
import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
