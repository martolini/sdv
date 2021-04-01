import React from 'react';
import { ThemeProvider, defaultTheme, Pane } from 'evergreen-ui';
import { merge } from 'lodash';
import '@fontsource/vt323';

function MyApp({ Component, pageProps }) {
  return (
    <Pane fontFamily="VT323">
      <Component {...pageProps} />
    </Pane>
  );
}
export default MyApp;
