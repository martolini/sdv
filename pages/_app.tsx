import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
export default MyApp;
