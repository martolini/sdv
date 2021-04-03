import React from 'react';
import { ThemeProvider } from 'evergreen-ui';
import SiteLayout from 'components/SiteLayout';
import theme from 'utils/theme';
import 'react-circular-progressbar/dist/styles.css';
import { FirebaseAppProvider } from 'reactfire';
import { firebaseConfig } from 'config';
import 'firebase/firestore';

function MyApp({ Component, pageProps, ...props }) {
  const { withLayout = true } = props;
  return (
    <ThemeProvider value={theme}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        {withLayout ? (
          <SiteLayout>
            <Component {...pageProps} />{' '}
          </SiteLayout>
        ) : (
          <Component {...pageProps} />
        )}
      </FirebaseAppProvider>
    </ThemeProvider>
  );
}

export default MyApp;
