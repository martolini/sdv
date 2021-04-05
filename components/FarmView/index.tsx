import MapView from 'components/MapView';
import { FarmItem } from 'typings/stardew';
import FarmOverlayView from '../FarmOverlawView';

const MAP_SIZES = {
  Farm: { x: 80, y: 65 },
  Greenhouse: { x: 20, y: 24 },
};

type FarmViewProps = {
  items?: FarmItem[];
};

export default function FarmView({ items }: FarmViewProps) {
  return <MapView items={items} map="Farm" />;
}
