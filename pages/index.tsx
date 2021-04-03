import Head from 'next/head';
import { Heading, toaster } from 'evergreen-ui';
import FileUploader from 'components/FileUploader';
import { useParsedGame } from 'hooks/useParsedGame';
import FarmerStats from 'components/FarmerStats';

export default function Home() {
  const { setParsedGame } = useParsedGame();

  return (
    <div>
      <Head>
        <title>Stardew Guide 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading size={800}>Welcome!</Heading>
      <FileUploader
        onFinished={(game) => {
          setParsedGame(game);
          toaster.success(
            `Successfully uploaded farm ${game.gameInfo.farmName}`
          );
        }}
      />
      <FarmerStats />
    </div>
  );
}
