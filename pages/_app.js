import 'antd/dist/antd.css';
import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { getFarmState } from '../utils/firebase-admin';
import Layout from '../components/Layout';
import FileDropContainer from '../components/FileDropContainer';

const theme = {};

function MyApp({ Component, pageProps }) {
  const [gameState, setGameState] = useState(pageProps);

  return (
    <ThemeProvider theme={theme}>
      <FileDropContainer
        onFinished={state => {
          setGameState(state);
        }}
      >
        <Layout {...gameState}>
          <Component {...gameState} />
        </Layout>
      </FileDropContainer>
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async function(context) {
  const pageProps = {};
  if (typeof window !== 'undefined') {
    return { pageProps };
  }
  const {
    query: { id },
  } = context.ctx;
  if (!id) {
    return { pageProps };
  }
  try {
    const state = await getFarmState(id);
    return {
      pageProps: state,
    };
  } catch (ex) {
    console.error(ex);
    return {
      pageProps,
    };
  }
};

export default MyApp;
