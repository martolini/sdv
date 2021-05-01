import { Pane, Text, toaster, useTheme } from 'evergreen-ui';
import React, { useEffect, useMemo } from 'react';
import WikiSearch from 'components/WikiSearch';
import { useParsedGame } from 'hooks/useParsedGame';
import FileUploadListener from 'components/FileUploadListener';
import usePrevious from 'hooks/usePrevious';
import { ParsedGame } from 'utils/parser';

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
  const theme = useTheme();
  const gameInfo = useMemo(() => {
    if (parsedGame) {
      const {
        gameInfo: { currentSeason, dayOfMonth, year, farmName, dailyLuck },
      } = parsedGame;
      const weekday = DAYS[dayOfMonth % 7];
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
    <Pane display="flex" padding={10} borderBottom alignItems="center">
      <Pane width="30%">
        {gameInfo && (
          <Pane
            display="flex"
            justifyContent="space-around"
            alignItems="center"
          >
            <Text fontSize="1.1rem">{gameInfo.farmName}</Text>
            <Text fontSize="1rem">{`${gameInfo.weekday} ${gameInfo.dayOfMonth} ${gameInfo.currentSeason}, YEAR ${gameInfo.year}`}</Text>
          </Pane>
        )}
      </Pane>
      <Pane width="40%">
        <WikiSearch />
      </Pane>
      <Pane
        width="30%"
        display="flex"
        justifyContent="space-around"
        alignItems="center"
      >
        {gameInfo && (
          <Text
            fontSize="1rem"
            color={theme.colors.text.success}
          >{`${gameInfo.dailyLuck}% luck`}</Text>
        )}
        <FileUploadListener />
      </Pane>
    </Pane>
  );
}
