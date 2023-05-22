import Head from 'next/head';
import Header from '../components/Header';
// import ManualHeader from '../components/ManualHeader';
import LotteryEntrance from '../components/LotteryEntrance';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Smart contract lottery</title>
        <meta name="description" content="Lottery blockchain" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <LotteryEntrance />
    </div>
  );
}
