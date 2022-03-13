import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { AppRegistry } from 'react-native';
import { RemixServer } from 'remix';
import type { EntryContext } from 'remix';
import { ReplaceWithStylesSSRTag } from './rn-styles';

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const App = () => <RemixServer context={remixContext} url={request.url} />;

  AppRegistry.registerComponent('App', () => App);

  let markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  );

  // @ts-expect-error error
  const { getStyleElement } = AppRegistry.getApplication('App', {});
  const stylesMarkup = renderToStaticMarkup(getStyleElement());

  markup = markup.replace(
    renderToStaticMarkup(ReplaceWithStylesSSRTag),
    stylesMarkup,
  );

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(`<!DOCTYPE html>${markup}`, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
