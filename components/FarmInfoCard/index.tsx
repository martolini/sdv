import { Pane, Badge, BadgeProps } from 'evergreen-ui';
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

const InfoBadge: React.FC<BadgeProps> = ({ children, color }) => (
  <Badge
    isSolid
    color={color}
    fontSize="1rem"
    fontWeight={100}
    letterSpacing="1px"
    marginY="5px"
  >
    {children}
  </Badge>
);

export default function FarmInfoCard() {
  const { parsedGame } = useParsedGame();
  const { gameInfo } = parsedGame;
  return (
    <Pane
      flexDirection="column"
      display="flex"
      justifyContent="space-around"
      flexWrap="wrap"
      width="100%"
    >
      <CardTitle>{gameInfo.farmName}</CardTitle>
      <InfoBadge color="yellow" height={20}>
        {DAYS[(gameInfo.dayOfMonth - 1) % 7]} {gameInfo.dayOfMonth}{' '}
        {gameInfo.currentSeason}, YEAR {gameInfo.year}
      </InfoBadge>
      <InfoBadge color="green">luck: {gameInfo.dailyLuck}%</InfoBadge>
    </Pane>
  );
}
