import "nightingale-app-console";
import Alp from "alp-node";
import { createWsServer } from "liwi-resources-websocket-server";
import { resourcesServerService } from "./resources";

const app = new Alp();

const server = await app.start(() => {
  // init
  // call here any init app

  // middlewares
  app.servePublic();
  app.catchErrors();
});

const wss = createWsServer(
  server,
  "/ws",
  resourcesServerService,
  () => undefined,
);

const cleanup = (): void => {
  server.close();
  if (wss) wss.close();
  app.close();
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
