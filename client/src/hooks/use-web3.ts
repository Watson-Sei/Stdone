import { useState, useEffect } from 'react';

interface Window {
    ethereum: any;
}

declare const window: Window;

export const useWallet = () => {
    const [walletAddress, setWalletAddress] = useState<string>("");

    const connectWeb3 = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
                setWalletAddress(accounts[0]);
            } catch (error: any) {
                if (error.code === 4001) {
                    setWalletAddress("");
                }
            }
        }
    }

    if (typeof window !== 'undefined') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            const {ethereum} = window;
            if (ethereum && ethereum.on) {
                if (ethereum.selectedAddress) {
                    setWalletAddress(ethereum.selectedAddress);
                }

                const handleAccountsChanged = (accounts: string[]) => {
                    if (accounts.length > 0) {
                        setWalletAddress(accounts[0]);
                    }
                };

                ethereum.on('accountsChanged', handleAccountsChanged);
            }
        }, [walletAddress]);
    }

    return {
        walletAddress,
        connectWeb3
    }
}