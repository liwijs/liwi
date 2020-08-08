import 'nightingale-app-console';
import Alp from 'alp-browser';
import createReactApp from 'alp-react/browser';
import BrowserApp from './web/BrowserApp';

const app = new Alp();

app.start(async () => {
  // init
  const browserApp = await app.init();

  // react app
  const renderApp = createReactApp(browserApp);
  renderApp(BrowserApp);
});
