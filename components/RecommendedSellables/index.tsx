import CardTitle from 'components/CardTitle';
import { Pane, Table } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import { useMemo } from 'react';
import { calculateRecommendedSellables } from './utils';

const RecommendedSellables: React.FC = () => {
  const { parsedGame } = useParsedGame();
  const recommended = useMemo(
    () => calculateRecommendedSellables(parsedGame).slice(0, 10),
    [parsedGame]
  );
  return (
    <Pane width="100%">
      <CardTitle>Recommended sellables</CardTitle>
      <Table marginTop={5}>
        <Table.Body maxHeight={240}>
          {recommended.map(({ name, stack, price, quality }) => (
            <Table.Row defaultValue="" key={`${name}_${quality}`}>
              <Table.TextCell textProps={{ fontSize: '1.1rem' }}>
                {name} x {stack}
              </Table.TextCell>
              <Table.TextCell textProps={{ fontSize: '1.1rem' }} isNumber>
                ${price}
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Pane>
  );
};

export default RecommendedSellables;
