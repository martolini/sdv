import React from 'react';
import { ThemeProvider } from 'evergreen-ui';
import SiteLayout from 'components/SiteLayout';
import theme from 'utils/theme';
import 'react-circular-progressbar/dist/styles.css';

function MyApp({ Component, pageProps, ...props }) {
  const { withLayout = true } = props;
  return (
    <ThemeProvider value={theme}>
      {withLayout ? (
        <SiteLayout>
          <Component {...pageProps} />{' '}
        </SiteLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </ThemeProvider>
  );
}

export default MyApp;
