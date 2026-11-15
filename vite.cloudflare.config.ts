import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({ server: { entry: "server" } }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      devOptions: { enabled: false },
      filename: "sw.js",
      manifest: false,
      includeAssets: ["icons/*.png", "manifest.webmanifest"],
      workbox: {
        globPatterns: ["**/*.{js,css,png,jpg,woff2}"],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) => request.mode === "navigate" && !url.pathname.startsWith("/~oauth") && !url.pathname.startsWith("/api") && !url.pathname.startsWith("/_serverFn"),
            handler: "NetworkFirst",
            options: { cacheName: "racqr-pages", networkTimeoutSeconds: 4, expiration: { maxEntries: 20, maxAgeSeconds: 604800 } },
          },
          {
            urlPattern: ({ url }) => url.origin === self.location.origin && /\/assets\/.*-[\w-]+\.(js|css|woff2|png|jpg)$/.test(url.pathname),
            handler: "CacheFirst",
            options: { cacheName: "racqr-assets", expiration: { maxEntries: 80, maxAgeSeconds: 2592000 } },
          },
        ],
      },
    }),
  ],
});
