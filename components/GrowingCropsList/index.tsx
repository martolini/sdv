import CardTitle from 'components/CardTitle';
import { Table, Pane } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import { groupBy } from 'lodash';
import React, { useMemo } from 'react';

const GrowingCropsList: React.FC<{ width?: number }> = (props) => {
  const { parsedGame } = useParsedGame();
  const thingsInTheGround = useMemo(() => {
    if (!parsedGame) return [];
    const crops = Object.entries(groupBy(parsedGame.harvest, 'name'))
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
    <Pane flexDirection="column" width="100%" margin={12}>
      <CardTitle>What are you growing?</CardTitle>
      <Table>
        <Table.Body maxHeight={360}>
          {thingsInTheGround.map(({ name, amount }) => (
            <Table.Row key={name}>
              <Table.TextCell textProps={{ fontSize: '1.1rem' }}>
                {name}
              </Table.TextCell>
              <Table.TextCell textProps={{ fontSize: '1.1rem' }} isNumber>
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
