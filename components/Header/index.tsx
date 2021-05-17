import { Heading, Pane, Text, toaster } from 'evergreen-ui';
import React, { useEffect, useMemo } from 'react';
import { useParsedGame } from 'hooks/useParsedGame';
import FileUploadListener from 'components/FileUploadListener';
import usePrevious from 'hooks/usePrevious';
import { ParsedGame } from 'utils/parser';
import WikiSearch from 'components/WikiSearch';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function Header() {
  const { parsedGame } = useParsedGame();
  const gameInfo = useMemo(() => {
    if (parsedGame) {
      const {
        gameInfo: { currentSeason, dayOfMonth, year, farmName, dailyLuck },
      } = parsedGame;
      const weekday = DAYS[(dayOfMonth - 1) % 7];
      return {
        currentSeason,
        dayOfMonth,
        year,
        dailyLuck,
        weekday,
        farmName,
      };
    }
    return null;
  }, [parsedGame]);
  const previousGame = usePrevious<ParsedGame>(parsedGame);
  useEffect(() => {
    if (parsedGame && previousGame) {
      if (parsedGame.gameInfo.id !== previousGame.gameInfo.id) {
        toaster.success(
          `New savegame found, ${parsedGame.gameInfo.currentSeason} ${parsedGame.gameInfo.dayOfMonth} here we go!`
        );
      }
    }
  }, [parsedGame]);
  return (
    <Pane
      display="flex"
      padding={10}
      borderBottom
      alignItems="center"
      justifyContent="space-between"
    >
      <Pane width="20%">
        {gameInfo && (
          <>
            <Heading>{gameInfo.farmName}</Heading>
            <Text>{`${gameInfo.weekday} ${gameInfo.dayOfMonth} ${gameInfo.currentSeason}, YEAR ${gameInfo.year}`}</Text>
          </>
        )}
      </Pane>
      <Pane flex={1} justifyContent="center" maxWidth="30%">
        <WikiSearch />
      </Pane>
      <Pane width="20%" justifyContent="flex-end" display="flex">
        <FileUploadListener />
      </Pane>
    </Pane>
  );
}
