import Head from 'next/head';
import { Pane, Spinner, useTheme } from 'evergreen-ui';
import FileUploader from 'components/FileUploader';
import { useParsedGame } from 'hooks/useParsedGame';
import FarmerStats from 'components/FarmerStats';
import DashboardCard from 'components/DashboardCard';
import MissingIngredientsCard from 'components/MissingIngredientsCard';
import FarmInfoHeader from 'components/FarmInfoHeader';

export default function Home() {
  const { setParsedGame, parsedGame, loading } = useParsedGame();
  const theme = useTheme();
  const content = parsedGame ? (
    <Pane display="flex" flexFlow="row wrap" justifyContent="space-around">
      <FarmInfoHeader />
      <DashboardCard backgroundColor={theme.colors.background.blueTint}>
        <MissingIngredientsCard />
      </DashboardCard>
      <DashboardCard
        backgroundColor={theme.colors.background.greenTint}
        maxWidth="30%"
      >
        <FarmerStats />
      </DashboardCard>
    </Pane>
  ) : (
    <FileUploader
      onFinished={(game) => {
        setParsedGame(game);
      }}
    />
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
