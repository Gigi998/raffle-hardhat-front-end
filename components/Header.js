import { ConnectButton } from 'web3uikit';

const Header = () => {
  return (
    <div className="flex flex-row items-center border-b-2">
      <h2 className="p-4 text-3xl font-bold">Decentralized lottery</h2>
      <div className="ml-auto p-4">
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
};

export default Header;
