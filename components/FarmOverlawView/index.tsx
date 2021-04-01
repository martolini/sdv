import React from 'react';
import { Box, Tooltip } from '@chakra-ui/react';
import { FarmItem, Point } from 'typings/stardew';
import PlacedDiv from './PlacedDiv';

type FarmOverlayViewProps = {
  items: FarmItem[];
  mapSize: Point;
};

export default function FarmOverlayView(props: FarmOverlayViewProps) {
  const { items, mapSize } = props;

  return (
    <Box>
      {items.map((farmItem) => {
        const key = `${farmItem.x}_${farmItem.y}`;
        return (
          <PlacedDiv key={key} farmItem={farmItem} mapSize={mapSize}>
            <Tooltip hasArrow label={farmItem.name} placement="top">
              <span>{farmItem.dead ? 'X' : farmItem.daysToHarvest}</span>
            </Tooltip>
          </PlacedDiv>
        );
      })}
    </Box>
  );
}
