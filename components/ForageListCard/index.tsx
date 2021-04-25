import CardTitle from 'components/CardTitle';
import MapView from 'components/MapView';
import { Dialog, Pane, Paragraph } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import { useState } from 'react';
import { FarmItem, Map } from 'typings/stardew';
import { MAP_SIZES } from 'utils/lookups';

type Props = {};

const ForageListCard: React.FC<Props> = (props) => {
  const { parsedGame } = useParsedGame();
  const [chosenMap, setChosenMap] = useState<Map>(null);
  const { maps = [] } = parsedGame;
  const mapsToRender = maps.filter((m) => m.forage.length > 0);
  return (
    <Pane flexDirection="column" width="100%">
      <CardTitle>Forage on maps:</CardTitle>
      <hr color="#e6e6e6" />
      {chosenMap && (
        <Dialog
          isShown={!!chosenMap}
          title={`${chosenMap.name}`}
          hasHeader={false}
          width={
            MAP_SIZES[chosenMap.name].y >= MAP_SIZES[chosenMap.name].x
              ? '35%'
              : '70%'
          }
          hasFooter={false}
          onCloseComplete={() => {
            setChosenMap(null);
          }}
        >
          <MapView
            map={chosenMap.name}
            items={chosenMap.forage as FarmItem[]}
          />
        </Dialog>
      )}
      {mapsToRender.map((map) => (
        <Paragraph
          onClick={() => setChosenMap(map)}
          fontSize="1.1rem"
          marginBottom={15}
          key={map.name}
        >
          {map.name}
        </Paragraph>
      ))}
    </Pane>
  );
};

export default ForageListCard;
