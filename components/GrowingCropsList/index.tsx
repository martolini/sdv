import CardTitle from 'components/CardTitle';
import { Table, Pane } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import { groupBy } from 'lodash';
import React, { useState, useMemo } from 'react';

const GrowingCropsList: React.FC<{ width?: number }> = (props) => {
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
  return (
    <Pane flexDirection="column" width="100%" margin={12}>
      <CardTitle>What are you growing?</CardTitle>
      <Table marginTop={5}>
        <Table.Head>
          <Table.SearchHeaderCell
            fontSize="1.1rem"
            onChange={(val) => {
              setSearchQuery(val);
            }}
            value={searchQuery}
          />
          <Table.TextHeaderCell fontSize="1.1rem">Amount</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body height={240}>
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
