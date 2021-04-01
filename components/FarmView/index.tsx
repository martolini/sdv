import Image from 'next/image';
import { FarmItem } from 'typings/stardew';
import FarmOverlayView from '../FarmOverlawView';
import '@fontsource/vt323';

const MAP_SIZES = {
  Farm: { x: 80, y: 65 },
  Greenhouse: { x: 20, y: 24 },
};

type FarmViewProps = {
  items?: FarmItem[];
};

export default function FarmView(props: FarmViewProps) {
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
        <img src="/img/Farm.png" width="100%" height="100%"></img>
        <FarmOverlayView items={props.items} mapSize={MAP_SIZES.Farm} />
      </div>
    </div>
  );
}
