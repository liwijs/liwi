import type { NextPage } from 'next';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <ul>
      <li>
        <Link href="/websocket">Websocket</Link>
      </li>
      <li>
        <Link href="/idb">idb</Link>
      </li>
    </ul>
  );
};

export default Home;
