import React from 'react';
import { ThemeProvider } from 'evergreen-ui';
import SiteLayout from 'components/SiteLayout';
import theme from 'utils/theme';
import 'react-circular-progressbar/dist/styles.css';
import '@yaireo/tagify/src/tagify.scss';
import { FirebaseAppProvider } from 'reactfire';
import { firebaseConfig } from 'config';
import 'firebase/firestore';
import FarmProvider from 'components/FarmProvider';
import UploadDragHelper from 'components/UploadDragHelper';
import Router from 'next/router';
import './global.css';

Router.events.on('routeChangeComplete', (url) => {
  // @ts-ignore
  window.analytics.page(url);
});

function MyApp({ Component, pageProps, ...props }) {
  const { withLayout = true } = props;
  return (
    <ThemeProvider value={theme}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        {withLayout ? (
          <FarmProvider>
            <UploadDragHelper>
              <SiteLayout>
                <Component {...pageProps} />{' '}
              </SiteLayout>
            </UploadDragHelper>
          </FarmProvider>
        ) : (
          <Component {...pageProps} />
        )}
      </FirebaseAppProvider>
    </ThemeProvider>
  );
}

export default MyApp;
