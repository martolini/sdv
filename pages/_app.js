import 'antd/dist/antd.css';
import React from 'react';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { createStore, StoreProvider } from 'easy-peasy';
import { getFarmState } from '../utils/firebase-admin';
import storeModel from '../store';
import Layout from '../components/Layout';
import FileDropContainer from '../components/FileDropContainer';

const makeStore = initialState =>
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

  componentDidMount() {
    window.json = this.props.store.getState().gameState;
  }

  render() {
    const { Component, store, pageProps } = this.props;
    return (
      <StoreProvider store={store}>
        <FileDropContainer>
          <Layout>
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </Layout>
        </FileDropContainer>
      </StoreProvider>
    );
  }
}

export default withRedux(makeStore)(RootApp);
