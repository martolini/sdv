import React, { ReactNode } from 'react';
import Document, { Head, Main, NextScript, Html } from 'next/document';
import { extractStyles } from 'evergreen-ui';
import * as snippet from '@segment/snippet';

const {
  // This write key is associated with https://segment.com/nextjs-example/sources/nextjs.
  ANALYTICS_WRITE_KEY = 'uGgA2xByeWoPRyX1p5hDkE5TxuxgwYBm',
  NODE_ENV = 'development',
} = process.env;

type Props = {
  css: string;
  hydrationScript: ReactNode;
};
export default class MyDocument extends Document<Props> {
  static getInitialProps({ renderPage }) {
    const page = renderPage();
    // `css` is a string with css from both glamor and ui-box.
    // No need to get the glamor css manually if you are using it elsewhere in your app.
    //
    // `hydrationScript` is a script you should render on the server.
    // It contains a stringified version of the glamor and ui-box caches.
    // Evergreen will look for that script on the client and automatically hydrate
    // both glamor and ui-box.
    const { css, hydrationScript } = extractStyles();

    return {
      ...page,
      css,
      hydrationScript,
    };
  }

  renderSnippet() {
    const opts = {
      apiKey: ANALYTICS_WRITE_KEY,
      // note: the page option only covers SSR tracking.
      // Page.js is used to track other events using `window.analytics.page()`
      page: true,
    };

    if (NODE_ENV === 'development') {
      return snippet.max(opts);
    }

    return snippet.min(opts);
  }

  render() {
    const { css, hydrationScript } = this.props;

    return (
      <Html>
        <Head>
          <style dangerouslySetInnerHTML={{ __html: css }} />
          <script dangerouslySetInnerHTML={{ __html: this.renderSnippet() }} />
        </Head>

        <body style={{ padding: 0, margin: 0 }}>
          <Main />
          {hydrationScript}
          <NextScript />
        </body>
      </Html>
    );
  }
}
