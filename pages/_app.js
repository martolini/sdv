import 'antd/dist/antd.css';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import Layout from '../components/Layout';
import FileDropContainer from '../components/FileDropContainer';
import absoluteUrl from '../utils/absoluteUrl';

const theme = {};

function MyApp({ Component, selfProps = {}, componentProps = {} }) {
  return (
    <ThemeProvider theme={theme}>
      <FileDropContainer
        onFinished={() => {
          window.location.href = window.location.href;
        }}
      >
        <Layout {...selfProps}>
          <Component {...componentProps} />
        </Layout>
      </FileDropContainer>
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async context => {
  const output = {
    selfProps: {},
    componentProps: {},
  };
  const { id } = context.ctx.query;
  if (!id) {
    return output;
  }
  try {
    if (context.Component.getInitialProps) {
      output.componentProps = await context.Component.getInitialProps(context);
    }
    const { origin } = absoluteUrl(context.ctx.req, 'localhost:3000');
    const result = await fetch(`${origin}/api/info/${id}`);
    const info = await result.json();
    output.selfProps = {
      info,
    };
  } catch (ex) {
    console.error(ex);
  }
  return output;
};

export default MyApp;
