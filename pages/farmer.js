import React from 'react';
import { useStoreState } from 'easy-peasy';
import { Progress, Row, Col, Empty, Tooltip } from 'antd';
import { forceAsArray } from '../utils/stardew';

const SKILL_TABLE = {
  0: 'Farming',
  1: 'Fishing',
  2: 'Foraging',
  3: 'Mining',
  4: 'Combat',
};

const EXP_TABLE = {
  0: 0,
  1: 100,
  2: 380,
  3: 770,
  4: 1300,
  5: 2150,
  6: 3300,
  7: 4800,
  8: 6900,
  9: 10000,
  10: 15000,
};

const PROFESSIONS_TABLE = {
  Farming: {
    0: { name: 'Rancher', description: 'Animal products worth 20% more.' },
    1: { name: 'Tiller', description: 'Crops worth 10% more.' },
    2: {
      name: 'Coopmaster',
      description:
        'Befriend coop animals quicker.\nIncubation time cut in half.',
    },
    3: {
      name: 'Shepherd',
      description: 'Befriend barn animals quicker.\nSheep produce wool faster.',
    },
    4: {
      name: 'Artisan',
      description: 'Artisan goods (wine, cheese, oil, etc.) worth 40% more.',
    },
    5: { name: 'Agriculturist', description: 'All crops grow 10% faster.' },
  },
  Fishing: {
    6: { name: 'Fisher', description: 'Fish worth 25% more.' },
    7: {
      name: 'Trapper',
      description: 'Resources required to craft crab pots reduced.',
    },
    8: { name: 'Angler', description: 'Fish worth 50% more.' },
    9: { name: 'Pirate', description: 'Chance to find treasure doubled.' },
    10: {
      name: 'Mariner',
      description: 'Crab pots no longer produce junk items.',
    },
    11: {
      name: 'Luremaster',
      description: 'Crab pots no longer require bait.',
    },
  },
  Foraging: {
    12: { name: 'Forester', description: 'Trees drop 25% more wood.' },
    13: {
      name: 'Gatherer',
      description: 'Chance for double harvest of foraged items.',
    },
    14: {
      name: 'Lumberjack',
      description: 'All trees have a chance to drop hardwood.',
    },
    15: { name: 'Tapper', description: 'Syrups worth 25% more.' },
    16: {
      name: 'Botanist',
      description: 'Foraged items are always highest quality.',
    },
    17: {
      name: 'Tracker',
      description: 'Location of forageable items revealed.',
    },
  },
  Mining: {
    18: { name: 'Miner', description: '+1 ore per vein.' },
    19: {
      name: 'Geologist',
      description: 'Chance for gems to appear in pairs.',
    },
    20: { name: 'Blacksmith', description: 'Metal bars worth 50% more.' },
    21: { name: 'Prospector', description: 'Chance to find coal doubled.' },
    22: { name: 'Excavator', description: 'Chance to find geodes doubled.' },
    23: { name: 'Gemologist', description: 'Gems worth 30% more.' },
  },
  Combat: {
    24: { name: 'Fighter', description: 'All attacks deal 10% more damage.' },
    25: {
      name: 'Scout',
      description: 'Critical strike chance increased by 50%.',
    },
    26: { name: 'Brute', description: 'Deal 15% more damage.' },
    27: { name: 'Defender', description: '+25 HP.' },
    28: {
      name: 'Acrobat',
      description: 'Cooldown on special moves cut in half.',
    },
    29: { name: 'Desperado', description: 'Critical strikes are deadly.' },
  },
};

export default function PlayerView() {
  const players = useStoreState(state => state.players);
  if (Object.keys(players).length === 0) {
    return <Empty />;
  }
  const renderObject = Object.keys(players).map(playerName => {
    const player = players[playerName];
    const {
      experiencePoints: { int: experiencePoints },
    } = player;
    const levels = Object.keys(SKILL_TABLE).map(skillKey => {
      const skillName = SKILL_TABLE[skillKey];
      const stateKey = `${skillName.toLowerCase()}Level`;
      const level = player[stateKey];
      const exp = EXP_TABLE[level];
      const nextExp = EXP_TABLE[level + 1];
      const percentage =
        level === 10
          ? 100
          : ((experiencePoints[skillKey] - exp) / (nextExp - exp)) * 100;
      const chosenProfessions = forceAsArray(player.professions.int)
        .filter(prof => !!PROFESSIONS_TABLE[skillName][prof])
        .map((prof, idx) => (
          <Tooltip
            key={prof}
            placement="right"
            title={PROFESSIONS_TABLE[skillName][prof].description}
          >
            <div style={{ color: 'darkgray' }}>
              #{idx + 1}: {PROFESSIONS_TABLE[skillName][prof].name}
            </div>
          </Tooltip>
        ));
      return (
        <Col
          span={4}
          key={skillKey}
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          <div>
            {skillName}: {level}
            {chosenProfessions}
          </div>
          <Progress
            type="circle"
            key={skillKey}
            percent={Math.round(percentage)}
            style={{ paddingLeft: 10 }}
          />
        </Col>
      );
    });
    return (
      <div key={playerName}>
        <h1>{playerName}</h1>
        <Row>{levels}</Row>
      </div>
    );
  });
  return <div>{renderObject}</div>;
}
