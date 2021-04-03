import Head from 'next/head';
import { Pane, toaster } from 'evergreen-ui';
import FileUploader from 'components/FileUploader';
import { useParsedGame } from 'hooks/useParsedGame';
import FarmerStats from 'components/FarmerStats';
import FarmInfoCard from 'components/FarmInfoCard';

export default function Home() {
  const { setParsedGame } = useParsedGame();
  return (
    <div>
      <Head>
        <title>Stardew Guide 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <FarmInfoCard />
      <FarmerStats />
      <Pane marginTop={30}>
        <FileUploader
          onFinished={(game) => {
            setParsedGame(game);
            toaster.success(
              `Successfully uploaded farm ${game.gameInfo.farmName}`
            );
          }}
        />
      </Pane>
    </div>
  );
}
