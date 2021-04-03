import Head from 'next/head';
import { Pane, toaster } from 'evergreen-ui';
import FileUploader from 'components/FileUploader';
import { useParsedGame } from 'hooks/useParsedGame';
import FarmerStats from 'components/FarmerStats';
import FarmInfoCard from 'components/FarmInfoCard';
import RecommendedSellables from 'components/RecommendedSellables';

export default function Home() {
  const { setParsedGame, parsedGame } = useParsedGame();
  const content = parsedGame ? (
    <>
      <FarmerStats />
      <FarmInfoCard />
      <RecommendedSellables />
    </>
  ) : (
    <FileUploader
      onFinished={(game) => {
        setParsedGame(game);
        toaster.success(`Successfully uploaded farm ${game.gameInfo.farmName}`);
      }}
    />
  );
  return (
    <>
      <Head>
        <title>Stardew Guide 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Pane flexDirection="row" display="flex" justifyContent="space-between">
        {content}
      </Pane>
    </>
  );
}
