import React from 'react';
import { Popover, Tooltip } from 'antd';
import ReactJsonView from './JsonView';
import styled from 'styled-components';

const PlacedDiv = styled.div.attrs(props => ({
  style: {
    left: `${(props.c.x / props.mapSize.x) * 100}%`,
    top: `${(props.c.y / props.mapSize.y) * 100}%`,
    height: `${(props.tileSize * props.mapSize.x) / props.mapSize.y}%`,
    fontSize: `${((props.tileSize * props.mapSize.x) / props.mapSize.y) * 65}%`,
    width: `${props.tileSize}%`,
    lineHeight: 1,
    backgroundColor: props.c.dead
      ? '#111111'
      : props.c.done
      ? '#2ECC40'
      : typeof props.c.hoursUntilReady === 'number' &&
        props.c.minutesUntilReady !== 0 &&
        props.c.hoursUntilReady < 18
      ? '#EE8900'
      : '#FF4136',
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
  return items.map((c, i) => (
    <Tooltip title={`${c.name} [${c.daysToHarvest}]`} key={i}>
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
