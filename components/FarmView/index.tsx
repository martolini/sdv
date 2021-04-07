import MapView from 'components/MapView';
import { FarmItem } from 'typings/stardew';

type FarmViewProps = {
  items: FarmItem[];
};

export default function FarmView({ items }: FarmViewProps) {
  return <MapView items={items} map="Farm" />;
}
