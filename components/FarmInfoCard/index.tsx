import {
  Text,
  Card,
  Pane,
  Paragraph,
  Badge,
  BadgeProps,
  Table,
} from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import { groupBy } from 'lodash';
import { useMemo, useState } from 'react';

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
    marginLeft={10}
    color={color}
    fontSize="1rem"
    fontWeight={100}
    letterSpacing="1.3px"
  >
    {children}
  </Badge>
);

export default function FarmInfoCard() {
  const { parsedGame } = useParsedGame();
  const [searchQuery, setSearchQuery] = useState('');
  const thingsInTheGround = useMemo(() => {
    if (!parsedGame) return [];
    const crops = Object.entries(groupBy(parsedGame.harvest, 'name'))
      .map(([key, items]) => ({
        name: key,
        amount: items.length,
      }))
      .sort((a, b) => b.amount - a.amount);
    if (searchQuery.length > 0) {
      const regexp = new RegExp(searchQuery, 'gi');
      return crops.filter((crop) => crop.name.match(regexp));
    }
    return crops;
  }, [parsedGame, searchQuery]);
  if (!parsedGame) {
    return null;
  }
  const { gameInfo } = parsedGame;
  return (
    <Card
      backgroundColor="white"
      elevation={2}
      padding={16}
      borderRadius={15}
      margin={8}
    >
      <Pane flexDirection="row" display="flex">
        <Text textAlign="center" fontSize="1.8rem" marginRight={20}>
          {gameInfo.farmName}
        </Text>
        <Pane display="flex" alignItems="center" justifyContent="space-between">
          <InfoBadge color="yellow">
            {DAYS[(gameInfo.dayOfMonth - 1) % 7]} {gameInfo.dayOfMonth}{' '}
            {gameInfo.currentSeason}, YEAR {gameInfo.year}
          </InfoBadge>
          <InfoBadge color="green">luck: {gameInfo.dailyLuck}%</InfoBadge>
        </Pane>
      </Pane>
      <Pane marginTop={10}>
        <Paragraph fontSize="1.2rem">Your growing crops</Paragraph>
        <Table marginTop={5}>
          <Table.Head fontSize="1rem">
            <Table.SearchHeaderCell
              onChange={(val) => {
                setSearchQuery(val);
              }}
              value={searchQuery}
            />
            <Table.TextHeaderCell>Amount</Table.TextHeaderCell>
          </Table.Head>
          <Table.Body height={240}>
            {thingsInTheGround.map(({ name, amount }) => (
              <Table.Row key={name}>
                <Table.TextCell textProps={{ fontSize: '1rem' }}>
                  {name}
                </Table.TextCell>
                <Table.TextCell textProps={{ fontSize: '1rem' }} isNumber>
                  {amount}
                </Table.TextCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Pane>
    </Card>
  );
}
