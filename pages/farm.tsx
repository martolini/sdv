import FarmView from 'components/FarmView';
import { Spinner } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import { useMemo } from 'react';

export default function Farm() {
  const { parsedGame, loadingParsedGame } = useParsedGame();

  const farmCrops = useMemo(
    () =>
      parsedGame === null
        ? []
        : parsedGame.harvest.filter((h) => h.location === 'Farm'),
    [parsedGame]
  );
  return loadingParsedGame ? <Spinner /> : <FarmView items={farmCrops} />;
}
