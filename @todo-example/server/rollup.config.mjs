import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import config from "alp-rollup-plugin-config";
import createRollupConfig from "pob-babel/createRollupConfig.js";
import run from "pob-babel/plugin-run.cjs";

const watch = process.env.ROLLUP_WATCH === "true";

export default createRollupConfig({
  cwd: dirname(fileURLToPath(import.meta.url)),
  outDirectory: "build",
  plugins: [
    config({
      targets: [{ src: "src/config/**/*.yml" }],
    }),
    watch && run({ execArgv: ["--enable-source-maps"] }),
  ],
});
