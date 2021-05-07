import { GiLockedChest } from '@react-icons/all-files/gi/GiLockedChest';
import { Badge, Pane, StarIcon, Text } from 'evergreen-ui';
import Avatar from 'react-avatar';
import React from 'react';
import { qualityToColor } from 'utils/stardew-helpers';
import { SearchEntry } from './useSearch';
import styles from './Suggestion.module.css';

type Props = {
  item: SearchEntry;
  focused?: boolean;
  onFocused: () => void;
};

const Suggestion: React.FC<Props> = ({
  item,
  focused = false,
  onFocused = () => {},
}) => {
  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      className={`${styles.container} ${focused ? styles.focused : null}`}
      onMouseOver={onFocused}
      minHeight="80px"
    >
      <Text size={500}>
        {item.name}
        {item.stack && ` x ${item.stack}`}
      </Text>
      <Text>
        {item.qualities?.length
          ? item.qualities.map((quality) => (
              <StarIcon key={quality} color={qualityToColor(quality)} />
            ))
          : null}
      </Text>
      <Pane>
        {item.chests?.length
          ? item.chests.map((color) => (
              <GiLockedChest key={color} color={color} />
            ))
          : null}
      </Pane>
      <Pane>
        {item.players?.length
          ? item.players.map((player) => (
              <Avatar
                key={player}
                name={player}
                size="1.4rem"
                round
                textSizeRatio={2.5}
              />
            ))
          : null}
      </Pane>
      <Pane maxWidth="30%">
        {item.isOnMaps?.map((name) => (
          <Badge color="green" key={name} marginX={4}>
            {name}
          </Badge>
        ))}
      </Pane>
      {item.nextCropFinished !== undefined && (
        <Text>
          next in {item.nextCropFinished} days
          {item.amountInGround && (
            <Text size={300}> ({item.amountInGround} total)</Text>
          )}
        </Text>
      )}
    </Pane>
  );
};

export default Suggestion;
