import Head from 'next/head';
import { Button, Heading, Text, TabNavigation, Tab } from 'evergreen-ui';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Stardew Guide 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading size={800}>Welcome!</Heading>
      <Button>Thank you!</Button>
      <TabNavigation>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
        <Tab>Tab 4</Tab>
        <Tab>Tab 5</Tab>
      </TabNavigation>
      <Text>How are you</Text>
    </div>
  );
}
