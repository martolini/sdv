import CardTitle from 'components/CardTitle';
import { Table, Pane } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import { groupBy } from 'lodash';
import React, { useMemo } from 'react';

const GrowingCropsList: React.FC = () => {
  const { parsedGame } = useParsedGame();
  const thingsInTheGround = useMemo(() => {
    if (!parsedGame) return [];
    const crops = Object.entries(
      groupBy(
        parsedGame.harvest.filter((i) => !i.dead),
        'name'
      )
    )
      .map(([key, items]) => ({
        name: key,
        amount: items.length,
      }))
      .sort((a, b) => b.amount - a.amount);
    return crops;
  }, [parsedGame]);
  if (!parsedGame) {
    return null;
  }
  return (
    <Pane flexDirection="column" width="100%">
      <CardTitle>What are you growing?</CardTitle>
      <hr color="#e6e6e6" />
      <Table width="100%">
        <Table.Body maxHeight={360}>
          {thingsInTheGround.map(({ name, amount }) => (
            <Table.Row key={name}>
              <Table.TextCell textProps={{ fontSize: '1.1rem' }}>
                {name}
              </Table.TextCell>
              <Table.TextCell
                textProps={{ fontSize: '1.1rem' }}
                isNumber
                flexBasis={50}
                flexShrink={0}
                flexGrow={0}
              >
                {amount}
              </Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </Pane>
  );
};

export default GrowingCropsList;