import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'styled-components';
import { getStorage } from '../utils/firebase';
import { getFarmState } from '../utils/firebase-admin';
import qs from 'query-string';
import axios from 'axios';
import { goCrazyWithJson } from '../utils/stardew';
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
    return {};
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
