import { execSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { MongoMemoryServer } from "mongodb-memory-server-core";
import { createDaemon } from "springbokjs-daemon";

export default async function globalSetup(config) {
  const cwd = fileURLToPath(new URL("..", import.meta.url));
  const cwdServer = fileURLToPath(new URL("../../server", import.meta.url));

  if (process.env.CI) {
    execSync("npx playwright install chromium --with-deps");
  }

  spawnSync(
    process.argv0,
    [
      fileURLToPath(
        new URL("../../../node_modules/next/dist/bin/next", import.meta.url),
      ),
      "build",
    ],
    {
      cwd,
      stdio: "inherit",
      env: { NODE_ENV: "production" },
    },
  );

  const mongodPromise = MongoMemoryServer.create();

  spawnSync(
    process.argv0,
    [
      fileURLToPath(
        new URL(
          "../../../node_modules/rollup/dist/bin/rollup",
          import.meta.url,
        ),
      ),
      "--config",
      "rollup.config.mjs",
    ],
    {
      cwd: cwdServer,
      stdio: "inherit",
      env: { NODE_ENV: "production" },
    },
  );

  const mongod = await mongodPromise;

  const daemonNext = createDaemon({
    command: process.argv0,
    cwd,
    args: ["../../node_modules/next/dist/bin/next", "start"],
  });
  const daemonServer = createDaemon({
    command: process.argv0,
    cwd: cwdServer,
    args: ["build/index-node.mjs"],
    env: {
      NODE_ENV: "test",
      MONGO_PORT: String(mongod.instanceInfo?.port),
    },
  });

  const cleanup = () => {
    return Promise.all([mongod.stop(), daemonNext.stop(), daemonServer.stop()]);
  };

  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);
  process.on("exit", cleanup);

  // dont wait for daemonNext as next does not support process.send('ready')
  daemonNext.start().catch(console.error);
  await Promise.all([daemonServer.start()]);
}
