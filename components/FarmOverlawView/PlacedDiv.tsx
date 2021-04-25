import { Pane } from 'evergreen-ui';
import { FarmItem, Point } from 'typings/stardew';

const getColorForTile = (
  dead: boolean,
  done: boolean,
  daysToHarvest: number
) => {
  return dead
    ? '#111111'
    : done
    ? '#2ECC40'
    : daysToHarvest === 0
    ? '#EE8900'
    : '#FF4136';
};

type PlacedDivProps = {
  mapSize: Point;
  farmItem: FarmItem;
};

export default function PlacedDiv({
  mapSize,
  farmItem,
  children,
}: React.PropsWithChildren<PlacedDivProps>) {
  const tileSize = 100 / mapSize.x;
  return (
    <Pane
      display="flex"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      cursor="pointer"
      position="absolute"
      color="white"
      fontWeight={800}
      left={`${(farmItem.x / mapSize.x) * 100}%`}
      top={`${(farmItem.y / mapSize.y) * 100}%`}
      height={`${(tileSize * (farmItem.height || 1) * mapSize.x) / mapSize.y}%`}
      fontSize={`${((tileSize * mapSize.x) / mapSize.y) * 65}%`}
      width={`${tileSize * (farmItem.width || 1)}%`}
      lineHeight={1}
      hoverElevation={1}
      backgroundColor={getColorForTile(
        farmItem.dead,
        farmItem.done,
        farmItem.daysToHarvest
      )}
    >
      {children}
    </Pane>
  );
}
