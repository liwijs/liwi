import { execSync, spawnSync } from 'child_process';
// import { createRequire } from 'module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import type { Daemon } from 'springbokjs-daemon';
import { createDaemon } from 'springbokjs-daemon';

xdescribe('test e2e', () => {
  const cwd = new URL('..', import.meta.url).pathname;
  const cwdServer = new URL('../../server', import.meta.url).pathname;
  let daemonNext: Daemon;
  let daemonServer: Daemon;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    // const require = createRequire(import.meta.url);\

    if (process.env.CI) {
      execSync('npx playwright install chromium --with-deps');
    }

    spawnSync(
      process.argv0,
      ['../../node_modules/next/dist/bin/next', 'build'],
      {
        cwd,
        stdio: 'inherit',
        env: {
          NODE_ENV: 'production',
        },
      },
    );

    spawnSync(
      process.argv0,
      [
        '../../node_modules/rollup/dist/bin/rollup',
        '--config',
        'rollup.config.mjs',
      ],
      {
        cwd: cwdServer,
        stdio: 'inherit',
        env: {
          NODE_ENV: 'production',
        },
      },
    );

    mongod = await MongoMemoryServer.create();

    daemonNext = createDaemon({
      command: process.argv0,
      cwd,
      args: ['../../node_modules/next/dist/bin/next', 'start'],
    });
    daemonServer = createDaemon({
      command: process.argv0,
      cwd: cwdServer,
      args: ['build/index-node16.mjs'],
      env: {
        NODE_ENV: 'test',
        MONGO_PORT: String(mongod.instanceInfo?.port),
      },
    });
    // dont wait for daemonNext as next does not support process.send('ready')
    daemonNext.start().catch(console.error);
    await Promise.all([daemonServer.start()]);
  }, 60_000);

  afterAll(async () => {
    await Promise.all([
      daemonNext?.stop(),
      daemonServer?.stop(),
      mongod?.stop(),
    ]);
  });

  test('Todo App', () => {
    spawnSync(
      process.argv0,
      ['../../node_modules/@playwright/test/cli.js', 'test', 'e2e/'],
      {
        cwd,
        stdio: 'inherit',
        env: {
          NODE_ENV: 'production',
        },
      },
    );
  });
});
