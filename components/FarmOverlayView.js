import React from 'react';
import { Popover, Tooltip } from 'antd';
import ReactJsonView from './JsonView';
import styled from 'styled-components';

const PlacedDiv = styled.div.attrs(props => ({
  style: {
    left: `${(props.c.x / props.mapSize.x) * 100}%`,
    top: `${(props.c.y / props.mapSize.y) * 100}%`,
    height: `${(props.tileSize * props.mapSize.x) / props.mapSize.y}%`,
    width: `${props.tileSize}%`,
    backgroundColor: props.c.dead
      ? '#111111'
      : props.c.done
      ? '#2ECC40'
      : '#FF4136',
  },
}))`
  text-align: center;
  cursor: pointer;
  position: absolute;
  color: white;
  font-size: 0.7rem;
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
            window={window || {}}
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
