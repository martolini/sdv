import { Tooltip, Text } from 'evergreen-ui';
import React from 'react';
import { FarmItem, Point } from 'typings/stardew';
import PlacedDiv from './PlacedDiv';

type FarmOverlayViewProps = {
  items: FarmItem[];
  mapSize: Point;
};

export default function FarmOverlayView(props: FarmOverlayViewProps) {
  const { items, mapSize } = props;

  return (
    <div>
      {items.map((farmItem) => {
        const key = `${farmItem.x}_${farmItem.y}`;
        return (
          <PlacedDiv key={key} farmItem={farmItem} mapSize={mapSize}>
            <Tooltip content={farmItem.name}>
              <Text color="white" fontSize="110%">
                {farmItem.dead ? 'X' : farmItem.daysToHarvest}
              </Text>
            </Tooltip>
          </PlacedDiv>
        );
      })}
    </div>
  );
}
