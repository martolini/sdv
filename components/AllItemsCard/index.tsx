import CardTitle from 'components/CardTitle';
import { Table, Pane, Avatar, StarIcon } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import React, { useMemo, useRef, useState } from 'react';
import { GiLockedChest } from '@react-icons/all-files/gi/GiLockedChest';
import { chain, values } from 'lodash';
import { qualityToColor } from 'utils/stardew-helpers';
import { Item } from 'typings/stardew';
import StardewWikiLink from 'components/Shared/StardewWikiLink';
import useHotkeyToFocus from 'hooks/useHotkeyToFocus';

type KeyedItem = Item & { key: string };

const AllItemsCard: React.FC = () => {
  const { parsedGame } = useParsedGame();
  const [filterValue, setFilterValue] = useState('');

  const allItems: KeyedItem[] = useMemo(() => {
    return values(
      chain(parsedGame.items)
        .groupBy(
          (item) =>
            `${item.itemId}_${item.quality}_${item.chestColor || item.player}`
        )
        .reduce((p, current, key) => [
          ...p,
          {
            key,
            ...current[0],
            stack: current.reduce((p, c) => p + c.stack, 0),
          },
        ])
        .value() as KeyedItem[]
    )
      .flat()
      .filter((item) => item.key !== undefined);
  }, [parsedGame]);

  const tableRows = useMemo(
    () =>
      allItems
        .filter((i) =>
          filterValue ? new RegExp(filterValue, 'i').test(i.name) : true
        )
        .map(({ name, stack, chestColor, player, quality, key }) => (
          <Table.Row key={key}>
            <Table.TextCell textProps={{ fontSize: '1.1rem' }}>
              <StardewWikiLink name={name} />
              {quality > 0 && (
                <StarIcon size={12} color={qualityToColor(quality)} />
              )}
              {stack && ` (${stack})`}
            </Table.TextCell>
            <Table.TextCell
              textProps={{ fontSize: '1.1rem' }}
              isNumber
              flexBasis={70}
              flexShrink={0}
              flexGrow={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
            >
              {chestColor ? (
                <GiLockedChest color={`#${chestColor}`} />
              ) : (
                <Avatar
                  name={player || ''}
                  size={35}
                  getInitials={(name) => name.substring(0, 2).toUpperCase()}
                />
              )}
            </Table.TextCell>
          </Table.Row>
        )),
    [allItems, filterValue]
  );
  const inputRef = useRef<any>();
  const hotkeys = useMemo(() => ['i'], []);
  useHotkeyToFocus(inputRef, hotkeys);
  return (
    <Pane flexDirection="column" height={430} width="100%">
      <CardTitle>Search in inventory</CardTitle>
      <hr color="#e6e6e6" />
      <Table width="100%">
        <Table.Head>
          <Table.SearchHeaderCell
            ref={inputRef}
            onChange={(value) => setFilterValue(value)}
          />
        </Table.Head>
        <Table.Body maxHeight={360}>{tableRows}</Table.Body>
      </Table>
    </Pane>
  );
};

export default AllItemsCard;
