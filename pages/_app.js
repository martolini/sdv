import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'styled-components';
import { getStorage } from '../utils/firebase';
import qs from 'query-string';
import axios from 'axios';
import { goCrazyWithJson } from '../utils/stardew';
import Layout from '../components/Layout';
import FileDropContainer from '../components/FileDropContainer';

const theme = {};

function MyApp({ Component, pageProps }) {
  const routerData = useRouter();
  const [gameState, setGameState] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Fetch data
    const { id } = qs.parse(routerData.asPath.split('?')[1]);
    const fetchData = async () => {
      setLoading(true);
      try {
        const storageRef = getStorage()
          .ref('farms')
          .child(id);
        const url = await storageRef.getDownloadURL();
        const data = (await axios.get(url)).data;
        const state = await goCrazyWithJson(data.SaveGame);
        setGameState(state);
      } catch (ex) {
        console.log(ex);
      }
      setLoading(false);
    };
    if (id) {
      fetchData();
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <FileDropContainer
        onFinished={state => {
          setGameState(state);
          setLoading(false);
        }}
      >
        <Layout {...gameState}>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <Component {...pageProps} {...gameState} />
          )}
        </Layout>
      </FileDropContainer>
    </ThemeProvider>
  );
}

export default MyApp;
