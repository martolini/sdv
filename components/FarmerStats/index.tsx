import { Card, Heading } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';

export default function FarmerStats() {
  const { parsedGame } = useParsedGame();
  const players = parsedGame ? parsedGame.players : [];
  return (
    <Card>
      <Heading>Hello</Heading>
    </Card>
  );
}
