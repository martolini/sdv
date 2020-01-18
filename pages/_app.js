import 'antd/dist/antd.css';
import React from 'react';
import App from 'next/app';
import withRedux from 'next-redux-wrapper';
import { createStore, StoreProvider } from 'easy-peasy';
import { getFarmState } from '../utils/firebase-admin';
import storeModel from '../store';
import Layout from '../components/Layout';
import { Button, Modal } from 'antd';
import FileDropContainer from '../components/FileDropContainer';

const makeStore = (initialState, options) =>
  createStore(storeModel, {
    initialState,
  });

class RootApp extends App {
  state = {
    modalOpen: true,
  };

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
        const farmState = await getFarmState(id);
        ctx.store.dispatch.setFullState(farmState);
      } catch (ex) {
        console.error(ex);
      }
    }
    return pageProps;
  }

  componentDidMount() {
    window.json = this.props.store.getState().gameState;
  }

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    const { modalOpen } = this.state;
    const { Component, store, pageProps } = this.props;
    return (
      <StoreProvider store={store}>
        <FileDropContainer>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Modal
            title="Welcome to the amazing Stardew Valley Tool"
            visible={modalOpen}
            footer={[
              <Button key="submit" type="primary" onClick={this.closeModal}>
                Have fun!
              </Button>,
            ]}
            onCancel={this.closeModal}
          >
            <p>
              This tool is simply designed to help you plan a new day on your
              farm, to get the most out of your time playing the game. You can
              preview planted crops, artisan equipment, animals, player
              progress, and much more..
            </p>
            <p>
              Take a look at one the latest uploaded farms, or drop a save file
              anywhere on this site to upload and preview your own farm. The
              save file (e.g. named Player_123456789) is located under:
            </p>
            <p>
              <ul>
                <li>
                  Windows: <code>%AppData%\StardewValley\Saves\</code>
                </li>
                <li>
                  Mac OSX & Linux: <code>~/.config/StardewValley/Saves/</code>
                </li>
              </ul>
            </p>
          </Modal>
        </FileDropContainer>
      </StoreProvider>
    );
  }
}

export default withRedux(makeStore)(RootApp);
