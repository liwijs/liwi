import { Helmet, AppContainer } from 'alp-react';
import { hot } from 'alp-react/hot';
import type { ReactElement } from 'react';
import React from 'react';
import './Layout.global.scss';
import App from './App';

export default hot(
  (): ReactElement => {
    return (
      <AppContainer>
        <Helmet>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />

          {/* <link rel="icon" type="image/png" href={favicon} /> */}
        </Helmet>
        <App />
      </AppContainer>
    );
  },
);
