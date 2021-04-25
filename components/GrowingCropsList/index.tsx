import CardTitle from 'components/CardTitle';
import StardewWikiLink from 'components/Shared/StardewWikiLink';
import { Table, Pane } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import { groupBy } from 'lodash';
import React, { useMemo } from 'react';
import { AiOutlineFieldTime } from '@react-icons/all-files/ai/AiOutlineFieldTime';

const GrowingCropsList: React.FC = () => {
  const { parsedGame } = useParsedGame();
  const thingsInTheGround = useMemo(() => {
    if (!parsedGame) return [];
    const crops = Object.entries(
      groupBy(
        parsedGame.harvest.filter(
          (i) => !i.dead && i.name.indexOf('empty') === -1
        ),
        'name'
      )
    )
      .map(([key, items]) => ({
        name: key,
        amount: items.length,
        done: items.some((i) => i.done),
        daysToHarvest: items.reduce(
          (p, c) => (c.daysToHarvest < p ? c.daysToHarvest : p),
          Infinity
        ),
      }))
      .sort((a, b) => b.amount - a.amount);
    return crops;
  }, [parsedGame]);
  const rows = useMemo(() => {
    return thingsInTheGround.map(({ name, amount, daysToHarvest, done }) => (
      <Table.Row key={name}>
        <Table.TextCell textProps={{ fontSize: '1.1rem' }}>
          <StardewWikiLink name={name} /> x {amount}
        </Table.TextCell>
        <Table.TextCell
          textProps={{ fontSize: '1.1rem', color: done ? 'green' : 'inherit' }}
          isNumber
          flexBasis={100}
          flexShrink={0}
          flexGrow={0}
          textAlign="right"
        >
          {daysToHarvest}
          <AiOutlineFieldTime
            style={{
              paddingLeft: 10,
              float: 'right',
            }}
          />
        </Table.TextCell>
      </Table.Row>
    ));
  }, [thingsInTheGround]);
  return (
    <Pane flexDirection="column" width="100%">
      <CardTitle>What are you growing?</CardTitle>
      <hr color="#e6e6e6" />
      <Table width="100%">
        <Table.Body maxHeight={360}>{rows}</Table.Body>
      </Table>
    </Pane>
  );
};

export default GrowingCropsList;
