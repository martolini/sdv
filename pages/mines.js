import { useStoreState } from 'easy-peasy';
import { Descriptions, Empty } from 'antd';
import CSRandom from '../utils/csrandom';

export default function Mines() {
  const gameState = useStoreState(state => state.gameState);
  if (Object.keys(gameState).length === 0) {
    return <Empty />;
  }
  const quarryUnlocked = !!gameState.player.mailReceived.string.find(
    t => t === 'ccCraftsRoom'
  );
  const daysPlayed = gameState.player.stats.daysPlayed;
  const offset = 28 * Math.floor(daysPlayed / 28);
  const gameID = gameState.uniqueIDForThisGame;
  const data = {};
  for (let week = 0; week < 1; week++) {
    for (let weekDay = 4; weekDay < 5; weekDay++) {
      const infestedMonster = [];
      const infestedSlime = [];
      const quarryLevel = [];
      const rainbowLights = [];
      const dinoLevel = [];
      const day = 7 * week + weekDay + offset;
      for (let mineLevel = 1; mineLevel < 120; mineLevel++) {
        if (mineLevel % 5 === 0) {
          continue;
        }
        let skipMushroomCheck = false;
        var rng = new CSRandom(day + mineLevel * 100 + gameID / 2);
        if (
          rng.NextDouble() < 0.044 &&
          mineLevel % 40 > 5 &&
          mineLevel % 40 < 30 &&
          mineLevel % 40 !== 19
        ) {
          if (rng.NextDouble() < 0.5) {
            infestedMonster.push(mineLevel);
          } else {
            infestedSlime.push(mineLevel);
          }
          skipMushroomCheck = true;
        } else if (
          rng.NextDouble() < 0.044 &&
          quarryUnlocked &&
          mineLevel % 40 > 1
        ) {
          if (rng.NextDouble() < 0.25) {
            quarryLevel.push(mineLevel + '*');
          } else {
            quarryLevel.push(mineLevel);
          }
          skipMushroomCheck = true;
        }

        if (skipMushroomCheck) {
          continue;
        }

        // Reset the seed for checking Mushrooms. Note, there are a couple checks related to
        // darker than normal lighting. We don't care about the results but need to mimic them.
        rng = new CSRandom(day * mineLevel + 4 * mineLevel + gameID / 2);
        if (rng.NextDouble() < 0.3 && mineLevel > 2) {
          rng.NextDouble(); // checked vs < 0.3 again
        }
        rng.NextDouble(); // checked vs < 0.15
        if (rng.NextDouble() < 0.035 && mineLevel > 80) {
          rainbowLights.push(mineLevel);
        }
      }
      for (let mineLevel = 127; mineLevel < 621; mineLevel++) {
        rng = new CSRandom(day + mineLevel * 100 + gameID / 2);
        if (rng.NextDouble() < 0.044) {
          if (rng.NextDouble() < 0.5) {
            //infestedMonster.push(mineLevel);
          } else {
            //infestedSlime.push(mineLevel);
          }
          if (rng.NextDouble() < 0.5) {
            dinoLevel.push(mineLevel - 120);
          }
        }
      }
      data[day] = {
        infestedMonster,
        infestedSlime,
        quarryLevel,
        rainbowLights,
        dinoLevel,
      };
    }
  }
  const dayData = data[daysPlayed];
  return (
    <div>
      <h1 style={{ fontSize: 30 }}>Mines</h1>
      <Descriptions>
        <Descriptions.Item
          label={<span style={{ fontSize: 22 }}>Mushroom floor</span>}
        >
          <span style={{ fontSize: 18 }}>
            {dayData.rainbowLights.join(', ')}
          </span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span style={{ fontSize: 22 }}>Monster level</span>}
        >
          <span style={{ fontSize: 18 }}>
            {dayData.infestedMonster.join(', ')}
          </span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span style={{ fontSize: 22 }}>Slime level</span>}
        >
          <span style={{ fontSize: 18 }}>
            {dayData.infestedSlime.join(', ')}
          </span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span style={{ fontSize: 22 }}>Quarry levels</span>}
        >
          <span style={{ fontSize: 18 }}>{dayData.quarryLevel.join(', ')}</span>
        </Descriptions.Item>
        <Descriptions.Item
          label={<span style={{ fontSize: 22 }}>Dino level</span>}
        >
          <span style={{ fontSize: 18 }}>{dayData.dinoLevel.join(', ')}</span>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
}
