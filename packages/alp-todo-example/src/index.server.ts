import 'nightingale-app-console';
import type { Server } from 'http';
import Alp from 'alp-node';
import createReactApp from 'alp-react';
import type { ResourcesWebsocketServer } from 'liwi-resources-websocket-server';
import { createWsServer } from 'liwi-resources-websocket-server';
import { resourcesServerService } from './server/resources';
import App from './web/core/Layout';

const app = new Alp();
let wss: ResourcesWebsocketServer;

const createWss = (server: Server): void => {
  wss = createWsServer(server, '/ws', resourcesServerService, () => undefined);
};

// react app
const appCallback: ReturnType<typeof createReactApp> = module.hot
  ? (context) => {
      createReactApp(App)(context);
    }
  : createReactApp(App);

const p = app
  .start(() => {
    // init
    // call here any init app

    // middlewares
    app.servePublic();
    app.catchErrors();
    app.use(appCallback);
  })
  .then((server) => {
    createWss(server);
    return server;
  });

if (module.hot) {
  module.hot.accept('./web/core/Layout');
  module.hot.accept('./server/resources', () => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    p.then((server) => {
      wss.close();
      createWss(server);
    });
  });
}

const cleanup = (): void => {
  if (wss) wss.close();
  app.close();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
