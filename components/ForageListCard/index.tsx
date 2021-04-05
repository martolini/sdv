import CardTitle from 'components/CardTitle';
import MapView from 'components/MapView';
import { Pane, Paragraph, Tooltip } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';

type Props = {};

const ForageListCard: React.FC<Props> = (props) => {
  const { parsedGame } = useParsedGame();
  const { maps = [] } = parsedGame;
  const mapsToRender = maps.filter(
    (m) => m.name !== 'Farm' && m.forage.length > 0
  );
  return (
    <Pane flexDirection="column" width="100%">
      <CardTitle>Forage on maps:</CardTitle>
      <hr color="#e6e6e6" />
      {mapsToRender.map((map) => (
        <Tooltip
          position="top-right"
          appearance="card"
          content={
            <Pane>
              <MapView map={map.name} items={map.forage} />
            </Pane>
          }
        >
          <Paragraph fontSize="1.1rem" marginBottom={5}>
            {map.name}
          </Paragraph>
        </Tooltip>
      ))}
    </Pane>
  );
};

export default ForageListCard;
