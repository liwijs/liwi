import { fileURLToPath } from "node:url";
import { defineConfig } from "@playwright/test";
import { WEB_PORT } from "./e2e/ports.js";

export default defineConfig({
  testDir: "./e2e/",
  globalSetup: fileURLToPath(
    import.meta.resolve("./e2e/global-setup", import.meta.url),
  ),
  use: {
    baseURL: `http://127.0.0.1:${WEB_PORT}`,
  },
});
