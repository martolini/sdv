import 'antd/dist/antd.css';
import React, { useState, useEffect } from 'react';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { ThemeProvider } from 'styled-components';
import { createStore, StoreProvider } from 'easy-peasy';
import { getFarmState } from '../utils/firebase-admin';
import storeModel from '../store';
import Layout from '../components/Layout';
import FileDropContainer from '../components/FileDropContainer';
import { authenticate, addRecentlySeenId } from '../utils/firebase';

const theme = {};

const makeStore = (initialState, options) =>
  createStore(storeModel, {
    initialState,
  });

class RootApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps
      ? await Component.getInitialProps()
      : {};
    // Fetch initial state and populate store server-side
    if (typeof window !== 'undefined') {
      return { pageProps };
    }
    const {
      query: { id },
    } = ctx;
    if (id) {
      // Fetch farmstate
      try {
        const state = await getFarmState(id);
        ctx.store.dispatch.setFullState(state);
      } catch (ex) {
        console.error(ex);
      }
    }
    return pageProps;
  }

  render() {
    const { Component, store, pageProps } = this.props;
    return (
      <StoreProvider store={store}>
        <FileDropContainer>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </FileDropContainer>
      </StoreProvider>
    );
  }
}

export default withRedux(makeStore)(RootApp);
