import { Pane, Tab, TabNavigation, Text } from 'evergreen-ui';
import React from 'react';
import { useRouter } from 'next/router';
import WikiSearch from 'components/WikiSearch';
import Link from 'next/link';

type NavTabProps = {
  text: string;
  link: string;
  isSelected: boolean;
};
const NavTab = ({ text, link, isSelected }: NavTabProps) => (
  <Link href={link} key={link}>
    <Tab
      fontSize={16}
      key={link}
      is="a"
      href={link}
      id={link}
      isSelected={isSelected}
    >
      <Text fontSize="1.1rem" letterSpacing="1.1px" paddingX={8}>
        {text}
      </Text>
    </Tab>
  </Link>
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
    text: 'Inventory',
    link: '/inventory',
  },
];

export default function Header() {
  const router = useRouter();
  const { asPath } = router;
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
    </Pane>
  );
}
