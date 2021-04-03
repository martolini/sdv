import { ParsedGame } from 'utils/parser';
import { useCallback, useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';
import { useFirestore } from 'reactfire';
import { useRouter } from 'next/router';

const LOCALSTORAGE_KEY = '__SDV__SAVE';

const { useGlobalState } = createGlobalState<{
  parsedGame: ParsedGame | null;
}>({
  parsedGame: null,
});

export function useParsedGame() {
  const [parsedGame, setParsedGame] = useGlobalState('parsedGame');
  const router = useRouter();
  const firestore = useFirestore();
  const _setParsedGame = useCallback(async (game: ParsedGame) => {
    const versioned = JSON.stringify({ parsedGame: game, version: 1 });
    localStorage.setItem(LOCALSTORAGE_KEY, versioned);
    setParsedGame(game);
    await firestore
      .collection('newfarms')
      .doc(`${game.gameInfo.gameId}`)
      .set(JSON.parse(versioned).parsedGame);
  }, []);

  useEffect(() => {
    if (router.query.farm) {
      const ref = firestore
        .collection(`newfarms`)
        .doc(router.query.farm.toString())
        .onSnapshot((doc) => {
          if (doc.exists) {
            setParsedGame(doc.data() as ParsedGame);
          }
        });
      return ref;
    }
  }, [router.query.farm]);
  return {
    parsedGame,
    setParsedGame: _setParsedGame,
  };
}
