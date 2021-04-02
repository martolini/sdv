import {
  Autocomplete,
  Pane,
  Tab,
  TabNavigation,
  TextInput,
} from 'evergreen-ui';
import React from 'react';
import { useRouter } from 'next/router';

const NavTab = ({ text, link }: { text: string; link: string }) => (
  <Tab fontSize={16} key={link} is="a" href={link} id={link}>
    {text}
  </Tab>
);

export default function Header() {
  const router = useRouter();
  return (
    <Pane display="flex">
      <Pane width="30%">
        <TabNavigation>
          <NavTab text="Dashboard" link="/dashboard" />
          <NavTab text="Farm" link="/farm" />
          <NavTab text="Inventory" link="/inventory" />
          <NavTab text="Bundles" link="/dashboard" />
        </TabNavigation>
      </Pane>
      <Pane width="40%">
        <Autocomplete
          onChange={console.log}
          items={['1', '2', '3']}
          title="Search"
        >
          {(props) => {
            const { getInputProps, getRef, inputValue, openMenu } = props;
            return (
              <TextInput
                width="80%"
                marginLeft="10%"
                marginRight="10%"
                placeholder="Search"
                value={inputValue}
                ref={getRef}
                {...getInputProps({
                  onFocus: () => {
                    openMenu();
                  },
                })}
              />
            );
          }}
        </Autocomplete>
      </Pane>
      <Pane width="30%">
        <TabNavigation display="flex" justifyContent="flex-end">
          <NavTab text="Farmers" link="/farmers" />
        </TabNavigation>
      </Pane>
    </Pane>
  );
}
