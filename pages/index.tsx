import Head from 'next/head';
import { useMemo } from 'react';
import { Heading, Pane, Spinner } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import TodoList from 'components/TodoList';

export default function Home() {
  const { parsedGame, loading } = useParsedGame();
  const content = useMemo(() => {
    if (parsedGame) {
      return (
        <Pane marginY={24}>
          <Heading marginBottom={10}>Set your own goals</Heading>
          <TodoList />
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
      <Pane display="flex" width="60%" justifyContent="center">
        {loading ? <Spinner /> : content}
      </Pane>
    </>
  );
}
