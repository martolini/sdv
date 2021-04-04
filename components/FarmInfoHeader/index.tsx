import { Pane, Text, useTheme } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import CardTitle from 'components/CardTitle';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function FarmInfoHeader() {
  const { parsedGame } = useParsedGame();
  const { gameInfo } = parsedGame;
  const theme = useTheme();
  return (
    <Pane
      width="100%"
      backgroundColor="white"
      border
      padding={8}
      marginBottom={8}
      borderRadius={10}
      flexDirection="row"
      display="flex"
      alignItems="center"
      justifyContent="space-around"
    >
      <CardTitle>{gameInfo.farmName}</CardTitle>
      <Text fontSize="1.2rem" color={theme.colors.text.info}>
        {DAYS[(gameInfo.dayOfMonth - 1) % 7]} {gameInfo.dayOfMonth}{' '}
        {gameInfo.currentSeason}, YEAR {gameInfo.year}
      </Text>
      <Text color={theme.colors.text.success} fontSize="1.2rem">
        {gameInfo.dailyLuck}% luck
      </Text>
    </Pane>
  );
}
