import React, { useState } from 'react';
import { Checkbox, Divider, Tabs, Icon } from 'antd';
import { useStoreState } from 'easy-peasy';
import FarmOverlayView from '../components/FarmOverlayView';
import { MAP_SIZES } from '../utils/lookups';

const { TabPane } = Tabs;

function FarmView(props) {
  const { mapSize, mapUrl, harvest: harvestOnFarm = [] } = props;
  const [indeterminate, setIndeterminate] = useState(false);

  const cropsCountMap = harvestOnFarm.reduce((p, c) => {
    const existing = p[c.name] || 0;
    const acc = {
      ...p,
      [c.name]: existing + 1,
    };
    return acc;
  }, {});

  const cropsOptions = Object.keys(cropsCountMap)
    .map(key => ({
      label: `${key} (${cropsCountMap[key]})`,
      value: key,
    }))
    .sort(
      (a, b) =>
        cropsCountMap[b.value] - cropsCountMap[a.value] ||
        a.value.localeCompare(b.value)
    );

  const [checked, setChecked] = useState(cropsOptions.map(v => v.value));

  return (
    <div>
      <div
        style={{
          width: '15%',
          display: 'inline-block',
        }}
      >
        <Checkbox
          checked={checked.length === cropsOptions.length}
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
        <div style={{ display: 'inline-flex', position: 'relative' }}>
          <img
            src={mapUrl}
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
      </div>
      <div style={{ clear: 'both' }} />
    </div>
  );
}

export default function FarmContainer() {
  const harvestOnFarm = useStoreState(state =>
    state.harvest.itemsInLocation('Farm')
  );
  const harvestInGreenhouse = useStoreState(state =>
    state.harvest.itemsInLocation('Greenhouse')
  );
  return (
    <Tabs defaultActiveKey="1">
      <TabPane
        tab={
          <span style={{ fontSize: 16 }}>
            <Icon type="home" theme="twoTone" />
            Farm
          </span>
        }
        key="1"
      >
        <FarmView
          mapSize={MAP_SIZES.Farm}
          mapUrl="img/Farm.png"
          harvest={harvestOnFarm}
        />
      </TabPane>
      <TabPane
        tab={
          <span style={{ fontSize: 16 }}>
            <Icon type="picture" theme="twoTone" />
            Greenhouse
          </span>
        }
        key="2"
      >
        <FarmView
          mapSize={MAP_SIZES.Greenhouse}
          mapUrl="img/Greenhouse.png"
          harvest={harvestInGreenhouse}
        />
      </TabPane>
    </Tabs>
  );
}
