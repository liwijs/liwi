import type { DirectTransportClientOptions } from 'liwi-resources-direct-client';
import { createDirectTransportClient } from 'liwi-resources-direct-client';
import type { ReactElement } from 'react';
import React from 'react';
// import ReactAlpContext from 'react-alp-context';
import { TransportClientProvider } from 'react-liwi';
import { resourcesServerService } from 'server/resources';
import App from './core/Layout';

export default function ServerApp(): ReactElement {
  // const ctx = useContext(ReactAlpContext);

  return (
    <TransportClientProvider<DirectTransportClientOptions<null>>
      createFn={createDirectTransportClient}
      resourcesServerService={resourcesServerService}
      authenticatedUser={null}
      // authenticatedUser={ctx.sanitizedState.user}
    >
      <App />
    </TransportClientProvider>
  );
}
