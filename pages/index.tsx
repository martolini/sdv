import Head from 'next/head';
import { Pane, toaster } from 'evergreen-ui';
import FileUploader from 'components/FileUploader';
import { useParsedGame } from 'hooks/useParsedGame';
import FarmerStats from 'components/FarmerStats';
import FarmInfoCard from 'components/FarmInfoCard';
import RecommendedSellables from 'components/RecommendedSellables';
import GrowingCropsList from 'components/GrowingCropsList';
import DashboardCard from 'components/DashboardCard';
import MissingIngredientsCard from 'components/MissingIngredientsCard';

export default function Home() {
  const { setParsedGame, parsedGame } = useParsedGame();
  const content = parsedGame ? (
    <Pane display="flex" flexFlow="row wrap" justifyContent="center">
      <DashboardCard minWidth="40%">
        <FarmerStats />
      </DashboardCard>
      <DashboardCard minWidth="40%">
        <FarmInfoCard />
      </DashboardCard>
      <DashboardCard minWidth="40%">
        <RecommendedSellables />
      </DashboardCard>
      <DashboardCard minWidth="40%">
        <GrowingCropsList />
      </DashboardCard>
      <DashboardCard minWidth="40%">
        <MissingIngredientsCard />
      </DashboardCard>
    </Pane>
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
      <Pane display="flex">{content}</Pane>
    </>
  );
}
