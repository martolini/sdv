import React, { useState } from 'react';
import { Tooltip, Select, Divider } from 'antd';
import { useStoreState } from 'easy-peasy';
import { MAP_IMAGES, MAP_SIZES } from '../utils/lookups';

const createMapElements = (maps, foraging) => {
  const mapElements = maps.map(key => {
    const mapSize = MAP_SIZES[key];
    const mapUrl = MAP_IMAGES[key];
    const markers = (foraging[key] || []).map(({ x, y, name }) => {
      const top = (y / mapSize.y) * 100;
      const left = (x / mapSize.x) * 100;
      return (
        <Tooltip title={name} key={`${x}_${y}_${name}`}>
          <img
            src="https://stardew.djomp.co.uk/images/marker.png"
            style={{
              position: 'absolute',
              top: `${top}%`,
              left: `${left}%`,
            }}
            alt={name}
          />
        </Tooltip>
      );
    });
    return (
      <div key={key}>
        <div>
          <h3>
            <a name={key} href={`#${key}`}>
              {key} ({markers.length})
            </a>
          </h3>
        </div>
        <div
          style={{
            display: 'inline-block',
            top: 0,
            left: 0,
            position: 'relative',
          }}
        >
          <img
            alt={mapUrl}
            style={{ maxWidth: '100%', opacity: '50%' }}
            src={mapUrl}
            key={key}
          />
          {markers}
        </div>
      </div>
    );
  });
  return mapElements;
};

export default function Forage() {
  const foraging = useStoreState(state => state.foraging);
  const [selectedMaps, setSelectedMaps] = useState(Object.keys(MAP_IMAGES));
  return (
    <div>
      <div
        style={{
          width: '80%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <h1>
          Total count:
          {Object.keys(foraging).reduce((p, c) => p + foraging[c].length, 0)}
        </h1>
        <div>
          <Select
            allowClear
            mode="multiple"
            style={{ width: '80%' }}
            onChange={value => setSelectedMaps(value)}
            value={selectedMaps}
          >
            {Object.keys(MAP_IMAGES).map(key => {
              return (
                <Select.Option key={key} value={key}>
                  {key} [{(foraging[key] || []).length}]
                </Select.Option>
              );
            })}
          </Select>
        </div>
        {selectedMaps.map(m => (
          <div style={{ marginTop: 10, display: 'inline-block' }} key={m}>
            <a style={{ marginRight: 10 }} href={`#${m}`}>
              {m}
            </a>
          </div>
        ))}
        <Divider />
        {createMapElements(selectedMaps, foraging)}
      </div>
    </div>
  );
}
