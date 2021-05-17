import { Pane } from 'evergreen-ui';
import Head from 'next/head';
import Header from 'components/Header';

const SiteLayout: React.FC = ({ children }) => {
  return (
    <Pane>
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=VT323&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Header />
      <Pane paddingX={16} paddingY={24} display="flex" justifyContent="center">
        {children}
      </Pane>
    </Pane>
  );
};

export default SiteLayout;
