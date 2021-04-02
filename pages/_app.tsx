import React from 'react';
import { ThemeProvider, defaultTheme, Pane } from 'evergreen-ui';
import { merge } from 'lodash';
import SiteLayout from 'components/SiteLayout';
import '@fontsource/vt323';

const theme = merge(defaultTheme, {
  typography: {
    fontFamilies: {
      display: 'VT323',
      ui: 'VT323',
      mono: 'VT323',
    },
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider value={theme}>
      <SiteLayout>
        <Component {...pageProps} />
      </SiteLayout>
    </ThemeProvider>
  );
}
export default MyApp;
