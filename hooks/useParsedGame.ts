import { ParsedGame } from 'utils/parser';
import { useCallback, useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import { useFirestore } from 'reactfire';
import { useRouter } from 'next/router';

const { useGlobalState } = createGlobalState<{
  parsedGame: ParsedGame | null;
  loading: boolean;
}>({
  parsedGame: null,
  loading: true,
});

export function useParsedGame() {
  const [parsedGame, setParsedGame] = useGlobalState('parsedGame');
  const [loading, setLoading] = useGlobalState('loading');
  const firestore = useFirestore();
  const uploadFarm = useCallback(async (farm: ParsedGame) => {
    const versioned = JSON.stringify({ parsedGame: farm, version: 1 });
    await firestore
      .collection('newfarms')
      .doc(`${farm.gameInfo.gameId}`)
      .set(JSON.parse(versioned).parsedGame);
  }, []);

  return {
    parsedGame,
    setParsedGame,
    loading,
    setLoading,
    uploadFarm,
  };
}
