import Head from 'next/head';
import { Pane, Spinner } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import FileUploadListener from 'components/FileUploadListener';

export default function Home() {
  const { parsedGame, loading } = useParsedGame();
  const content = parsedGame ? (
    <Pane
      display="flex"
      flexFlow="row wrap"
      justifyContent="space-around"
    ></Pane>
  ) : (
    <FileUploadListener />
  );
  return (
    <>
      <Head>
        <title>Stardew Guide 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Pane display="flex">{loading ? <Spinner /> : content}</Pane>
    </>
  );
}
