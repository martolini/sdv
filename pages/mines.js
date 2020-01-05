import { useStoreState } from 'easy-peasy';
import { Descriptions, Empty } from 'antd';

export default function Mines() {
  const minesInfo = useStoreState(state => state.mines);
  if (Object.keys(minesInfo).length === 0) {
    return <Empty />;
  }
  const {
    rainbowLights,
    infestedSlime,
    infestedMonster,
    quarryLevel,
    dinoLevel,
  } = minesInfo;

  return (
    <div>
      <h1 style={{ fontSize: 30 }}>Mines</h1>
      <Descriptions>
        <Descriptions.Item
          label={<span style={{ fontSize: 22 }}>Mushroom floor</span>}
        >
          <span style={{ fontSize: 18 }}>{rainbowLights.join(', ')}</span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span style={{ fontSize: 22 }}>Monster level</span>}
        >
          <span style={{ fontSize: 18 }}>{infestedMonster.join(', ')}</span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span style={{ fontSize: 22 }}>Slime level</span>}
        >
          <span style={{ fontSize: 18 }}>{infestedSlime.join(', ')}</span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span style={{ fontSize: 22 }}>Quarry levels</span>}
        >
          <span style={{ fontSize: 18 }}>{quarryLevel.join(', ')}</span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span style={{ fontSize: 22 }}>Dino level</span>}
        >
          <span style={{ fontSize: 18 }}>{dinoLevel.join(', ')}</span>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
