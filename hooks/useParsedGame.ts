import { ParsedGame } from 'utils/parser';
import { useCallback, useEffect, useState } from 'react';

const LOCALSTORAGE_KEY = '__SDV__SAVE';

export function useParsedGame() {
  const [parsedGame, setParsedGame] = useState<ParsedGame | null>(null);

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
