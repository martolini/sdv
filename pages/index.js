import Head from 'next/head';
import { Button } from 'evergreen-ui';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Stardew Guide 2.0</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Button>Hello</Button>
      <p>How are you</p>
    </div>
  );
}
