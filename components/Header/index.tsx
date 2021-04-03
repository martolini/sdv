import { Button, Pane, Tab, TabNavigation, Text, toaster } from 'evergreen-ui';
import React from 'react';
import { useRouter } from 'next/router';
import WikiSearch from 'components/WikiSearch';
import Link from 'next/link';
import { useParsedGame } from 'hooks/useParsedGame';
import FileUploader from 'components/FileUploader';
import { CopyToClipboard } from 'react-copy-to-clipboard';

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
  const { asPath } = router;
  const { setParsedGame, parsedGame } = useParsedGame();

  return (
    <Pane display="flex" padding={5} borderBottom>
      <Pane width="30%">
        <TabNavigation>
          {LINKS.map(({ text, link }) => (
            <NavTab
              key={link}
              text={text.toUpperCase()}
              link={link}
              isSelected={asPath === link}
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
              toaster.success(
                `Copied ${window.location.origin}${window.location.pathname}?farm=${parsedGame.gameInfo.gameId} to clipboard`
              );
            }}
          >
            <Button
              marginRight={10}
              size={500}
              appearance="primary"
              intent="success"
              letterSpacing=".7px"
            >
              Share farm
            </Button>
          </CopyToClipboard>
        )}
        <FileUploader
          small
          onFinished={(game) => {
            setParsedGame(game);
            toaster.success(
              `Successfully uploaded farm ${game.gameInfo.farmName}`
            );
          }}
        />
      </Pane>
    </Pane>
  );
}
