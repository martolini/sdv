import BundlesTable from 'components/BundlesTable';
import { Spinner } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';

export default function Bundles() {
  const { parsedGame, loadingParsedGame } = useParsedGame();
  return loadingParsedGame ? (
    <Spinner />
  ) : (
    <BundlesTable bundleInfo={parsedGame && parsedGame.bundleInfo} />
  );
}
