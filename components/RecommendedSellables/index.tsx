import CardTitle from 'components/CardTitle';
import StardewWikiLink from 'components/Shared/StardewWikiLink';
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
      <hr color="#e6e6e6" />
      <Table>
        <Table.Body maxHeight={360}>
          {recommended.map(({ name, stack, price, quality }) => (
            <Table.Row defaultValue="" key={`${name}_${quality}`}>
              <Table.TextCell textProps={{ fontSize: '1.1rem' }}>
                <StardewWikiLink name={name} /> x {stack}
              </Table.TextCell>
              <Table.TextCell
                textProps={{ fontSize: '1.1rem' }}
                isNumber
                flexBasis={80}
                flexShrink={0}
                flexGrow={0}
              >
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
