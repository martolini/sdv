import CardTitle from 'components/CardTitle';
import { Table, Pane, Avatar } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import React, { useState } from 'react';
import { GiLockedChest } from '@react-icons/all-files/gi/GiLockedChest';

const AllItemsCard: React.FC = () => {
  const { parsedGame } = useParsedGame();
  const [filterValue, setFilterValue] = useState('');

  if (!parsedGame) {
    return null;
  }

  const allItems = parsedGame.items;
  return (
    <Pane flexDirection="column" height={430} width="100%">
      <CardTitle>Search in inventory</CardTitle>
      <hr color="#e6e6e6" />
      <Table width="100%">
        <Table.Head>
          <Table.SearchHeaderCell
            value={filterValue}
            onChange={(value) => setFilterValue(value.trim())}
          />
        </Table.Head>
        <Table.Body maxHeight={360}>
          {allItems
            .filter((i) =>
              filterValue ? new RegExp(filterValue, 'i').test(i.name) : true
            )
            .map(({ name, stack, chestColor, player }, i) => (
              <Table.Row key={i}>
                <Table.TextCell textProps={{ fontSize: '1.1rem' }}>
                  {name}
                  {stack && ` (${stack})`}
                </Table.TextCell>
                <Table.TextCell
                  textProps={{ fontSize: '1.1rem' }}
                  isNumber
                  flexBasis={50}
                  flexShrink={0}
                  flexGrow={0}
                >
                  {chestColor ? (
                    <GiLockedChest color={`#${chestColor}`} />
                  ) : (
                    <Avatar
                      name={player || ''}
                      size={25}
                      getInitials={(name) => name.substring(0, 2)}
                    />
                  )}
                </Table.TextCell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </Pane>
  );
};

export default AllItemsCard;
