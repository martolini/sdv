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
  if (typeof window !== 'undefined') {
    return { pageProps: {} };
  }
  const {
    query: { id },
  } = context.ctx;
  if (!id) {
    return {};
  }
  const state = await getFarmState(id);
  return {
    pageProps: state,
  };
};

export default MyApp;
