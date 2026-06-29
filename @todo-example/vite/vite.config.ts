import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Prebundle (esbuild) for the client. react-native-web is included so its CJS
// modules are converted to ESM, and the pre-built workspace packages are
// included so Vite does not try to load a tsconfig for their dist files when
// transforming them on the fly. react-native-web is only loaded on the client
// (see ConnectionStateBadge), so it never enters the SSR module graph.
const optimizeInclude = [
  "react-native-web",
  "react-liwi",
  "liwi-resources-client",
  "liwi-resources-void-client",
  "liwi-resources-websocket-client",
  "react-alp-connection-state",
];

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // nightingale-logger / nightingale-app-console read process.env.NODE_ENV,
  // which is undefined in the browser (Next.js used to polyfill it). Replace it
  // at build time so the client bundle does not throw "process is not defined".
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  resolve: {
    alias: {
      "react-native": "react-native-web",
    },
    extensions: [
      ".web.tsx",
      ".web.ts",
      ".web.jsx",
      ".web.js",
      ".tsx",
      ".ts",
      ".jsx",
      ".js",
      ".mjs",
      ".json",
    ],
  },
  optimizeDeps: {
    include: optimizeInclude,
  },
}));
