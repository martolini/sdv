import { Card, Paragraph, Text, Pane, Tooltip } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import { FaSeedling } from '@react-icons/all-files/fa/FaSeedling';
import { GiFishing } from '@react-icons/all-files/gi/GiFishing';
import { GiMushroomGills } from '@react-icons/all-files/gi/GiMushroomGills';
import { GiMiner } from '@react-icons/all-files/gi/GiMiner';
import { GiBroadsword } from '@react-icons/all-files/gi/GiBroadsword';

const icons = {
  Farming: {
    icon: FaSeedling,
    color: '#00783E',
  },
  Fishing: {
    icon: GiFishing,
    color: '#1070CA',
  },
  Foraging: {
    icon: GiMushroomGills,
    color: '#BF0E08',
  },
  Mining: {
    icon: GiMiner,
    color: '#95591E',
  },
  Combat: {
    icon: GiBroadsword,
    color: '#234361',
  },
};

export default function FarmerStats() {
  const { parsedGame } = useParsedGame();
  const players = parsedGame ? parsedGame.players : [];
  return (
    <Pane>
      {players.map((player) => (
        <Pane key={player.name}>
          <Paragraph
            fontSize="1.8rem"
            letterSpacing="1px"
            padding={16}
            textAlign="center"
          >
            {player.name}
          </Paragraph>
          <Pane display="flex" flexDirection="row">
            {player.skills.map((skill) => {
              const { icon: Icon, color } = icons[skill.name];
              return (
                <Tooltip
                  key={skill.name}
                  content={
                    <Card padding={8}>
                      <Paragraph color="white" fontSize="1.5rem">
                        {skill.name}
                      </Paragraph>
                      {skill.percentageToNextLevel !== 100 && (
                        <Paragraph color="white">
                          {100 - Math.round(skill.percentageToNextLevel)}% to
                          next level
                        </Paragraph>
                      )}
                      {skill.professions.map((prof, i) => (
                        <Paragraph color="white" key={prof.name}>
                          #{i + 1} {prof.name}
                        </Paragraph>
                      ))}
                    </Card>
                  }
                >
                  <Pane
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    padding={5}
                    hoverElevation={4}
                    key={skill.name}
                    borderRadius={10}
                  >
                    <CircularProgressbarWithChildren
                      value={skill.percentageToNextLevel}
                    >
                      <Text fontSize="1.5rem" color={color}>
                        {skill.level}
                      </Text>
                    </CircularProgressbarWithChildren>
                    <Pane padding={5}>
                      <Icon color={color} size="1.5rem" />
                    </Pane>
                  </Pane>
                </Tooltip>
              );
            })}
          </Pane>
        </Pane>
      ))}
    </Pane>
  );
}
