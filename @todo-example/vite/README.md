# @todo-example/vite

TodoMVC example for [liwi](https://github.com/christophehurpeau/liwi), built with [Vite](https://vite.dev/) and React 19 with server-side rendering.

The UI talks to the `@todo-example/server` websocket backend (default `ws://localhost:4005/ws`) through the liwi resources clients. During SSR a void transport client is used; on the client a websocket transport client takes over after hydration.

## Getting Started

Start the backend first (in `@todo-example/server`), then run the dev server:

```bash
yarn start
```

The dev server (`server.js`) runs Vite in middleware mode and renders each request through `src/entry-server.tsx`. Open [http://localhost:3000](http://localhost:3000).

Edit `src/App.tsx` or the components under `src/components/` — HMR updates the page as you edit.

## Production build

```bash
yarn build        # builds dist/client (browser) and dist/server (SSR bundle)
yarn start:prod   # NODE_ENV=production node server.js
```

`yarn preview` runs both steps in sequence.

## Architecture

- `index.html` — HTML template with the `<!--app-html-->` SSR placeholder.
- `src/entry-client.tsx` — hydrates the server-rendered markup.
- `src/entry-server.tsx` — exposes `render()` returning the markup string.
- `server.js` — Express server doing SSR in dev (Vite middleware) and prod (static `dist/client` + `dist/server` bundle).
- `vite.config.ts` — React plugin, `react-native` → `react-native-web` alias, `.web.*` resolution, and `ssr.noExternal` for the workspace/react-native packages.

## E2E

```bash
yarn test:e2e
```

Playwright (`e2e/global-setup.js`) builds the app, starts an in-memory MongoDB, the websocket backend, and the SSR server before running the tests.
