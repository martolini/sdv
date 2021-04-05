import { FarmItem, Rect } from 'typings/stardew';
import { MAP_IMAGES, MAP_SIZES } from 'utils/lookups';
import FarmOverlayView from '../FarmOverlawView';

type MapViewProps = {
  items?: FarmItem[];
  map: string;
};

export default function MapView({ map, items }: MapViewProps) {
  const mapSrc = MAP_IMAGES[map];
  const mapSize = MAP_SIZES[map];
  return (
    <div
      style={{
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        float: 'right',
        display: 'inline-block',
      }}
    >
      <div style={{ display: 'inline-flex', position: 'relative' }}>
        <img src={mapSrc} width="100%" height="100%"></img>
        <FarmOverlayView items={items} mapSize={mapSize} />
      </div>
    </div>
  );
}
