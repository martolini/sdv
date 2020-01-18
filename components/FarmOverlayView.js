import React from 'react';
import { Popover, Tooltip } from 'antd';
import styled from 'styled-components';
import ReactJsonView from './JsonView';

const getColorForTile = c => {
  if (c.dead) {
    return '#111111';
  }
  if (c.done) {
    return '#2ECC40';
  }
  if (
    typeof c.hoursUntilReady === 'number' &&
    c.minutesUntilReady !== 0 &&
    c.hoursUntilReady < 18
  ) {
    return '#EE8900';
  }
  return '#FF4136';
};

const PlacedDiv = styled.div.attrs(props => ({
  style: {
    left: `${(props.c.x / props.mapSize.x) * 100}%`,
    top: `${(props.c.y / props.mapSize.y) * 100}%`,
    height: `${(props.tileSize * (props.c.dy || 1) * props.mapSize.x) /
      props.mapSize.y}%`,
    fontSize: `${((props.tileSize * props.mapSize.x) / props.mapSize.y) * 65}%`,
    width: `${props.tileSize * (props.c.dx || 1)}%`,
    lineHeight: 1,
    backgroundColor: getColorForTile(props.c),
  },
}))`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  position: absolute;
  color: white;
  font-weight: 800;
  &:hover {
    opacity: 0.5;
  }
`;

export default function FarmOverlayView(props) {
  const { items, mapSize } = props;
  const tileSize = 100 / mapSize.x;
  return items.map(c => (
    <Tooltip title={`${c.name} [${c.daysToHarvest}]`} key={`${c.x}_${c.y}`}>
      <Popover
        content={
          <ReactJsonView
            src={c}
            name={false}
            collapsed={1}
            displayDataTypes={false}
            displayObjectSize={false}
            window={typeof window === 'undefined' ? null : window}
          />
        }
        title={c.name}
        trigger="click"
        placement="bottom"
      >
        <PlacedDiv tileSize={tileSize} c={c} mapSize={mapSize}>
          {c.dead ? 'X' : c.daysToHarvest}
        </PlacedDiv>
      </Popover>
    </Tooltip>
  ));
}
