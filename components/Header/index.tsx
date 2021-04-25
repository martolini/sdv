import { Button, Pane, Tab, TabNavigation, Text, toaster } from 'evergreen-ui';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import WikiSearch from 'components/WikiSearch';
import Link from 'next/link';
import { useParsedGame } from 'hooks/useParsedGame';
import FileUploadListener from 'components/FileUploadListener';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import usePrevious from 'hooks/usePrevious';
import { ParsedGame } from 'utils/parser';

type NavTabProps = {
  text: string;
  link: string;
  isSelected: boolean;
};
const NavTab = ({ text, link, isSelected }: NavTabProps) => (
  <Tab fontSize={16} key={link} id={link} isSelected={isSelected}>
    <Link href={link}>
      <Text fontSize="1.1rem" letterSpacing="1.1px" paddingX={8}>
        {text}
      </Text>
    </Link>
  </Tab>
);

const LINKS = [
  {
    text: 'Home',
    link: '/',
  },
  {
    text: 'Farm',
    link: '/farm',
  },
  {
    text: 'Bundles',
    link: '/bundles',
  },
];

export default function Header() {
  const router = useRouter();
  const { pathname, query } = router;
  const { parsedGame, uploadFarm } = useParsedGame();
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
  const queryParamLink = Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join('&');
  return (
    <Pane display="flex" padding={10} borderBottom alignItems="center">
      <Pane width="30%">
        <TabNavigation>
          {LINKS.map(({ text, link }) => (
            <NavTab
              key={link}
              text={text.toUpperCase()}
              link={`${link}${queryParamLink ? `?${queryParamLink}` : ''}`}
              isSelected={pathname === link}
            />
          ))}
        </TabNavigation>
      </Pane>
      <Pane width="40%">
        <WikiSearch />
      </Pane>
      <Pane width="30%" display="flex" justifyContent="flex-end">
        {parsedGame && (
          <CopyToClipboard
            text={`${window.location.origin}${window.location.pathname}?farm=${parsedGame.gameInfo.gameId}`}
            onCopy={() => {
              toaster.success(`${parsedGame.gameInfo.farmName} is now shared`, {
                description: `Copied the farm's url for you at ${window.location.origin}${window.location.pathname}?farm=${parsedGame.gameInfo.gameId} to your clipboard`,
              });
            }}
          >
            <Button
              marginRight={10}
              size={500}
              appearance="primary"
              intent="success"
              letterSpacing=".7px"
              onClick={() => {
                uploadFarm(parsedGame);
                router.push(
                  `${router.pathname}?farm=${parsedGame.gameInfo.gameId}`,
                  undefined,
                  {
                    shallow: true,
                  }
                );
              }}
            >
              Share farm
            </Button>
          </CopyToClipboard>
        )}
        <FileUploadListener />
      </Pane>
    </Pane>
  );
}
