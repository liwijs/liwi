import type { NextPage } from 'next';
import Head from 'next/head';
import Info from '../components/Info';
import Main from '../components/Main';
import { NewTaskForm } from '../components/NewTaskForm';
import Paginated from '../components/Paginated';

const Home: NextPage = () => {
  return (
    <>
      <section className="todoapp">
        <Head>
          <title>Todo App with liwi</title>
          <meta name="description" content="Todo App with liwi" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <header className="header">
          <h1>todos</h1>
          <NewTaskForm />
        </header>
        <Main />
      </section>
      <Info />

      <div style={{ display: 'flex' }}>
        <div style={{ flex: '0 0 50%' }}>
          Version subscribe=true
          <Paginated subscribe />
        </div>
        <div style={{ flex: '0 0 50%' }}>
          Version subscribe=false
          <Paginated subscribe={false} />
        </div>
      </div>
    </>
  );
};

export default Home;
