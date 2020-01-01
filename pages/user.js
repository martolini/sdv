import React from 'react';
import { Progress, Row, Col } from 'antd';
import { getPlayers } from '../utils/stardew';

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

export default function PlayerView(props) {
  const { gameState } = props;
  const players = getPlayers(gameState);
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
      return (
        <Col span={4} key={skillKey}>
          {skillName}: {level}
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
