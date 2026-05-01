import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    tailwind(),
    react(),
    icon(),
    sitemap({
      filter: (page) =>
        !page.includes("/crm") && !page.includes("/api/"),
    }),
  ],
  site: "https://trackora.tech",
});