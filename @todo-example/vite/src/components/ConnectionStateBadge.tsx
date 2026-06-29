import type { ReactNode } from "react";
import { ConnectionState } from "react-alp-connection-state";
import { transportClientStateToSimplifiedState } from "react-liwi";

interface ConnectionStateBadgeProps {
  transportClientState: Parameters<
    typeof transportClientStateToSimplifiedState
  >[0];
}

// react-alp-connection-state renders through react-native-web, which does not
// run under Vite's SSR module runner. This component is loaded only on the
// client (dynamic import in App), keeping react-native-web out of SSR.
export default function ConnectionStateBadge({
  transportClientState,
}: ConnectionStateBadgeProps): ReactNode {
  const state = transportClientStateToSimplifiedState(transportClientState);
  return <ConnectionState state={state}>{state}</ConnectionState>;
}
