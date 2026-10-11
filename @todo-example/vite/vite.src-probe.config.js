import { fileURLToPath } from "node:url";
import { defineConfig, mergeConfig } from "vite";
import baseConfig from "./vite.config.js";

const src = (dir) =>
  fileURLToPath(new URL(`../../${dir}/src/index.ts`, import.meta.url));

const packages = [
  "extended-json",
  "liwi-store",
  "liwi-resources",
  "liwi-resources-client",
  "liwi-resources-void-client",
  "liwi-resources-websocket-client",
  "react-liwi",
];

export default defineConfig((env) =>
  mergeConfig(baseConfig(env), {
    resolve: {
      alias: [
        ...packages.map((name) => ({
          find: new RegExp(`^${name}$`),
          replacement: src(`packages/${name}`),
        })),
        {
          find: /^@todo-example\/modules$/,
          replacement: src("@todo-example/modules"),
        },
      ],
    },
    optimizeDeps: { include: [], exclude: packages },
    ssr: { noExternal: packages },
  }),
);
