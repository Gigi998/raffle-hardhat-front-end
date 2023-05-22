import React, { useEffect, useState } from 'react';
import { useMoralis, useWeb3Contract } from 'react-moralis';
import { contractAddresses, abi } from '../constants';
import { ethers } from 'ethers';
import { useNotification } from 'web3uikit';

const LotteryEntrance = () => {
  const { chainId: chaindIdHex, isWeb3Enabled } = useMoralis();
  const dispatch = useNotification();
  const chainId = parseInt(chaindIdHex);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;

  const [entranceFee, setEntranceFee] = useState('0');
  const [numOfPlayers, setNumOfPlayers] = useState('0');
  const [recentWinner, setRecentWinner] = useState('0');

  const {
    runContractFunction: enterRaffle,
    isFetching,
    isLoading,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'enterRaffle',
    params: {},
    msgValue: entranceFee,
  });

  // Get the entrance fee
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getEntranceFee',
    params: {},
  });

  // Get the number of players
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getNumberOfPlayers',
    params: {},
  });

  // Get the number of players
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: 'getRecentWinner',
    params: {},
  });

  // Get the entrance fee from smart contract
  const updateUI = async () => {
    const entranceFeeCall = (await getEntranceFee()).toString();
    const numofPlayersCall = (await getNumberOfPlayers()).toString();
    const recentWinnerCall = (await getRecentWinner()).toString();
    setEntranceFee(entranceFeeCall);
    setNumOfPlayers(numofPlayersCall);
    setRecentWinner(recentWinnerCall);
  };

  // handle enter raffle click
  const enterRaffleClick = async () => {
    await enterRaffle({
      onSuccess: handleSuccess,
      onError: (error) => console.log(error),
    });
  };

  // Triggers when transacion go through, not when transaciton pass
  // SO we added tx.wait
  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUI();
  };

  const handleNewNotification = async () => {
    dispatch({
      type: 'info',
      message: 'Transaction complete',
      title: 'Tx notification',
      position: 'topR',
      icon: 'bell',
    });
  };

  // isWeb3Enabled is false at the init render, so we must add it to depend arr
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="p-4">
      <h2 className="text-3xl mb-3">Lottery Entrance</h2>
      {raffleAddress ? (
        <div className="flex flex-col items-start gap-3">
          <button
            className="bg-cyan-500 hover:bg-cyan-600 p-3 rounded-lg text-white"
            onClick={enterRaffleClick}
            disabled={isLoading || isFetching}
          >
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              <div>Enter the raffle</div>
            )}
          </button>
          <h2 className="text-2xl">
            Entrance fee:{' '}
            <span className="font-bold">
              {ethers.utils.formatUnits(entranceFee, 'ether')} ETH
            </span>
          </h2>
          <h2 className="text-2xl">Number of players: {numOfPlayers}</h2>
          <h2 className="text-2xl">
            Recent winner: <span className="font-bold">{recentWinner}</span>
          </h2>
        </div>
      ) : (
        <h2 className="text-2xl">No raffle address detected</h2>
      )}
    </div>
  );
};

export default LotteryEntrance;
