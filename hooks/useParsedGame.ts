import { ParsedGame } from 'utils/parser';
import { useCallback, useEffect } from 'react';
import { createGlobalState } from 'react-hooks-global-state';

const LOCALSTORAGE_KEY = '__SDV__SAVE';

const { useGlobalState } = createGlobalState<{
  parsedGame: ParsedGame | null;
}>({
  parsedGame: null,
});

export function useParsedGame() {
  const [parsedGame, setParsedGame] = useGlobalState('parsedGame');
  const _setParsedGame = useCallback((game: ParsedGame) => {
    localStorage.setItem(
      LOCALSTORAGE_KEY,
      JSON.stringify({
        parsedGame: game,
        version: 1,
      })
    );
    setParsedGame(game);
  }, []);
  useEffect(() => {
    // Fetch initial state
    const data = localStorage.getItem(LOCALSTORAGE_KEY);
    if (data) {
      const json = JSON.parse(data);
      setParsedGame(json.parsedGame);
    }
  }, []);
  return {
    parsedGame,
    setParsedGame: _setParsedGame,
  };
}
