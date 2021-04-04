import FarmView from 'components/FarmView';
import { Spinner } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import { useMemo } from 'react';

export default function Farm() {
  const { parsedGame, loading } = useParsedGame();

  const farmCrops = useMemo(
    () =>
      parsedGame === null
        ? []
        : parsedGame.harvest.filter((h) => h.location === 'Farm'),
    [parsedGame]
  );
  return loading ? <Spinner /> : <FarmView items={farmCrops} />;
}
