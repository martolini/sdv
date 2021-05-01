import Head from 'next/head';
import { useMemo } from 'react';
import { Pane, Spinner } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import WikiSearch from 'components/WikiSearch';

export default function Home() {
  const { parsedGame, loading } = useParsedGame();
  const content = useMemo(() => {
    if (parsedGame) {
      return (
        <Pane width="70%">
          <WikiSearch />
        </Pane>
      );
    }
  }, [parsedGame]);
  return (
    <>
      <Head>
        <title>Stardew Guide 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Pane display="flex" width="70%" justifyContent="center">
        {loading ? <Spinner /> : content}
      </Pane>
    </>
  );
}
