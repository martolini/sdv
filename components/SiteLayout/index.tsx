import Header from 'components/Header';
import { Pane, useTheme } from 'evergreen-ui';
import Head from 'next/head';

const SiteLayout: React.FC = ({ children }) => {
  const theme = useTheme();
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
      <Pane
        paddingX={16}
        paddingY={24}
        backgroundColor={theme.palette.neutral.lightest}
        display="flex"
        justifyContent="center"
      >
        {children}
      </Pane>
    </Pane>
  );
};

export default SiteLayout;
