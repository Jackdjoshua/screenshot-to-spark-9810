// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// Never set ssr.external or resolve.external: the Worker has no runtime module resolution, so
// the build fails. Never add compression (compressPublicAssets, vite-plugin-compression):
// hosting already compresses at the edge.
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  vite: { plugins: [VitePWA({ registerType:'autoUpdate', injectRegister:null, devOptions:{enabled:false}, filename:'sw.js', manifest:false, includeAssets:['icons/*.png','manifest.webmanifest'], workbox:{globPatterns:['**/*.{js,css,png,jpg,woff2}'],navigateFallback:null,runtimeCaching:[{urlPattern:({request,url})=>request.mode==='navigate'&&!url.pathname.startsWith('/~oauth')&&!url.pathname.startsWith('/api')&&!url.pathname.startsWith('/_serverFn'),handler:'NetworkFirst',options:{cacheName:'racqr-pages',networkTimeoutSeconds:4,expiration:{maxEntries:20,maxAgeSeconds:604800}}},{urlPattern:({url})=>url.origin===self.location.origin&&/\/assets\/.*-[\w-]+\.(js|css|woff2|png|jpg)$/.test(url.pathname),handler:'CacheFirst',options:{cacheName:'racqr-assets',expiration:{maxEntries:80,maxAgeSeconds:2592000}}}]}})] },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
