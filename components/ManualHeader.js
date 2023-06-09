import React from 'react';
import { UseMoralis, useMoralis } from 'react-moralis';
import { useEffect } from 'react';

function ManualHeader() {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    // already connected
    if (isWeb3Enabled) return;
    if (
      typeof window !== 'undefined' &&
      window.localStorage.getItem('connected')
    ) {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`Account changed to ${account}`);
      // Disconnected
      if (account == null) {
        // Remove from loc storage if we disconnect
        window.localStorage.removeItem('connected');
        deactivateWeb3();
        console.log('No account found');
      }
    });
  }, []);

  const handleConnect = async () => {
    await enableWeb3();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('connected', 'injected');
    }
  };

  return (
    <nav>
      {account ? (
        <div>
          Connected to {account.slice(0, 6)}...
          {account.slice(account.length - 4)}{' '}
        </div>
      ) : (
        <button onClick={handleConnect} disabled={isWeb3EnableLoading}>
          Connect
        </button>
      )}
    </nav>
  );
}

export default ManualHeader;
