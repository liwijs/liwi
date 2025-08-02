import pobTypescriptConfig, { applyTs } from "@pob/eslint-config-typescript";
import pobTypescriptReactConfig from "@pob/eslint-config-typescript-react";

const pobTypescriptConfigs = pobTypescriptConfig(import.meta.url).configs;
const pobTypescriptReactConfigs = pobTypescriptReactConfig(
  import.meta.url,
).configs;

const warnUnsafeConfig = {
  rules: {
    "@typescript-eslint/no-unsafe-argument": "warn",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-unsafe-call": "warn",
    "@typescript-eslint/no-unsafe-member-access": "warn",
    "@typescript-eslint/no-unsafe-return": "warn",
    "@typescript-eslint/use-unknown-in-catch-callback-variable": "warn",
  },
};

export default [
  ...pobTypescriptConfigs.node,

  ...applyTs({
    mode: "directory",
    files: ["@todo-example/server/src/"],
    configs: [...pobTypescriptConfigs.node],
  }),

  ...applyTs({
    mode: "directory",
    files: ["packages/liwi-mongo-example/src/"],
    configs: [...pobTypescriptConfigs.app],
  }),
  ...applyTs({
    mode: "directory",
    files: ["@todo-example/*/src/"],
    configs: [...pobTypescriptConfigs.app, warnUnsafeConfig],
  }),
  {
    files: [
      "@todo-example/nextjs/src/**/*.{ts,tsx}",
      "@todo-example/server/src/**/*.ts",
    ],

    settings: {
      "import/resolver": {
        node: {
          moduleDirectory: ["node_modules", "src"],
        },
      },
    },
  },
  {
    ignores: [
      "@todo-example/nextjs/.next",
      "@todo-example/nextjs/out",
      "@todo-example/nextjs/build",
    ],
  },
  ...applyTs({
    mode: "directory",
    files: ["@todo-example/nextjs/src/"],
    configs: [
      ...pobTypescriptReactConfigs.base,
      warnUnsafeConfig,
      {
        rules: {
          "react/function-component-definition": [
            "error",
            {
              namedComponents: ["function-declaration", "arrow-function"],
              unnamedComponents: "arrow-function",
            },
          ],
        },
      },
    ],
  }),
  ...applyTs({
    mode: "directory",
    files: [
      "packages/liwi-{mongo,resources,resources-client,resources-direct-client,resources-server,resources-void-client,resources-websocket-client,resources-websocket-server,store,subscribe-store}/src/",
    ],
    configs: [
      warnUnsafeConfig,
      {
        rules: {
          "@typescript-eslint/no-floating-promises": "warn",
        },
      },
    ],
  }),
  ...applyTs({
    mode: "directory",
    files: [
      "packages/{react-liwi,liwi-resources-client,liwi-resources-websocket-client,liwi-resources,liwi-store,liwi-subscribe-store}/src/",
    ],
    configs: [
      ...pobTypescriptReactConfigs.base,
      warnUnsafeConfig,
      {
        rules: {
          "@typescript-eslint/no-floating-promises": "warn",
        },
      },
    ],
  }),
];
