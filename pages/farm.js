import React, { useState } from 'react';
import { Checkbox, Divider } from 'antd';
import { useStoreState } from 'easy-peasy';
import FarmOverlayView from '../components/FarmOverlayView';

export default function FarmView() {
  const [checked, setChecked] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const harvestOnFarm = useStoreState(state => state.harvestOnFarm);
  const mapSize = { x: 80, y: 65 };

  const cropsCountMap = harvestOnFarm.reduce((p, c) => {
    const existing = p[c.name] || 0;
    p[c.name] = existing + 1;
    return p;
  }, {});

  const cropsOptions = Object.keys(cropsCountMap).map(key => ({
    label: `${key} (${cropsCountMap[key]})`,
    value: key,
  }));

  return (
    <div>
      <div
        style={{
          width: '15%',
          display: 'inline-block',
        }}
      >
        <Checkbox
          onChange={e => {
            setIndeterminate(false);
            setChecked(e.target.checked ? cropsOptions.map(o => o.value) : []);
          }}
          indeterminate={indeterminate}
        >
          Check all ({Object.values(cropsCountMap).reduce((p, c) => p + c, 0)})
        </Checkbox>
        <Divider />
        <Checkbox.Group
          options={cropsOptions}
          value={checked}
          onChange={c => {
            setIndeterminate(!!c.length && c.length < cropsOptions.length);
            setChecked(c);
          }}
        />
      </div>
      <div
        style={{
          position: 'relative',
          top: 0,
          left: 0,
          width: '80%',
          float: 'right',
          display: 'inline-block',
        }}
      >
        <img
          src="/img/Farm.png"
          style={{ maxWidth: '100%', opacity: '100%' }}
          alt="farm"
        />
        <FarmOverlayView
          items={harvestOnFarm.filter(c =>
            c.name === undefined
              ? checked.includes('undefined')
              : checked.includes(c.name)
          )}
          mapSize={mapSize}
        />
      </div>
      <div style={{ clear: 'both' }} />
    </div>
  );
}
