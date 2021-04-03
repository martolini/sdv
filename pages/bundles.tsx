import BundlesTable from 'components/BundlesTable';
import { useParsedGame } from 'hooks/useParsedGame';

export default function Bundles() {
  const { parsedGame } = useParsedGame();
  return <BundlesTable bundleInfo={parsedGame && parsedGame.bundleInfo} />;
}
