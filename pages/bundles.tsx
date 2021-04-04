import BundlesTable from 'components/BundlesTable';
import { Spinner } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';

export default function Bundles() {
  const { parsedGame, loading } = useParsedGame();
  return loading ? (
    <Spinner />
  ) : (
    <BundlesTable bundleInfo={parsedGame && parsedGame.bundleInfo} />
  );
}
