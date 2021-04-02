import FarmView from 'components/FarmView';
import { useParsedGame } from 'hooks/useParsedGame';
import { useMemo } from 'react';

export default function Farm() {
  const { parsedGame } = useParsedGame();
  const farmCrops = useMemo(
    () =>
      parsedGame === null
        ? []
        : parsedGame.harvest.filter((h) => h.location === 'Farm'),
    [parsedGame]
  );
  return <FarmView items={farmCrops} />;
}
