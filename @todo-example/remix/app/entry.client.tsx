import { hydrate } from 'react-dom';
import { AppRegistry } from 'react-native';
import { RemixBrowser } from 'remix';
import { ReactNativeStylesContext } from './rn-styles';

AppRegistry.registerComponent('App', () => RemixBrowser);

// @ts-ignore
const { getStyleElement } = AppRegistry.getApplication('App');

hydrate(
  <ReactNativeStylesContext.Provider value={getStyleElement()}>
    <RemixBrowser />
  </ReactNativeStylesContext.Provider>,
  document,
);
