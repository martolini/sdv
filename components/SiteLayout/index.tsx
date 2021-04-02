import Header from 'components/Header';
import { Pane } from 'evergreen-ui';
import Head from 'next/head';

const SiteLayout: React.FC = ({ children }) => {
  return (
    <Pane padding={5}>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header />
      <Pane marginX={16} marginY={24}>
        {children}
      </Pane>
    </Pane>
  );
};

export default SiteLayout;
