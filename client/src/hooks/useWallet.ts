import { ContractTransaction, ethers } from 'ethers';
import BigNumber from 'bignumber.js';
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {walletAddressState, chainIdState, walletProviderState, accountBalanceState, accessTokenState} from '../stores/atoms';
import Donate from '../contracts/Donate.json';
import ERC20 from '../contracts/WERC20.json';

interface Window {
    ethereum: any;
}

declare const window: Window;

interface TypeInstalled {
    isInstalled: boolean;
    returnProvider: any;
}

export const useWallet = () => {
    const [walletAddress, setWalletAddress] = useRecoilState(walletAddressState);
    const [chainId, setChainId] = useRecoilState(chainIdState);
    const [walletProvider, setWalletProvider] = useRecoilState(walletProviderState);
    const [accountBalance, setAccountBalance] = useRecoilState(accountBalanceState);
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

    // is Metamask
    const isMetamaskInstalled = (): TypeInstalled => {
        const {ethereum} = window;
        if (!Boolean(ethereum)) {
            return {isInstalled: false, returnProvider: null};
        }
        if (!ethereum.isMetaMask) {
            return {isInstalled: false, returnProvider: null};
        }
        if (ethereum.isMetaMask && !ethereum.providers) {
            return {isInstalled: true, returnProvider: ethereum};
        }
        if (ethereum.isMetaMask && ethereum.providers) {
            const provider = ethereum.providers.find((provider: { isMetaMask: any; }) => provider.isMetaMask);
            return {isInstalled: true, returnProvider: provider};
        }
        return {isInstalled: false, returnProvider: null}
    }

    // is Coinbase Wallet
    const isCoinbaseWalletInstalled = (): TypeInstalled => {
        const {ethereum} = window;
        if (!Boolean(ethereum)) {
            return {isInstalled: false, returnProvider: null};
        }
        if (ethereum.isWalletLink) {
            return {isInstalled: true, returnProvider: ethereum};
        }
        if (ethereum.isMetaMask && ethereum.providers) {
            const provider = ethereum.providers.find((provider: {isWalletLink: any}) => provider.isWalletLink);
            return {isInstalled: true, returnProvider: provider};
        }
        return {isInstalled: false, returnProvider: null};
    }

    const connectWallet = async (detect: string) => {
        setChainId('');
        setWalletAddress('');
        setWalletProvider('');
        let provider: any;
        console.log(detect)
        if (detect === 'metamask') {
            const {isInstalled, returnProvider} = isMetamaskInstalled();
            if (!isInstalled) {
                console.log("Please Install Metamask");
                return;
            }
            setWalletProvider('metamask');
            provider = returnProvider;
        } else if (detect === 'coinbase') {
            const {isInstalled, returnProvider} = isCoinbaseWalletInstalled();
            if (!isInstalled) {
                console.log("Please Install Coinbase Wallet");
                return;
            }
            setWalletAddress('coinbase');
            provider = returnProvider;
        } else {
            console.log("What's up!")
            return;
        }
        try {
            await provider.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x7a69' }]
            })
            const accounts = await provider.request({ method: 'eth_requestAccounts' });
            setWalletAddress(accounts[0])
            setChainId(provider.chainId);
            fetch(`${import.meta.env.VITE_API_URL}/user/findPublicAddress?publicAddress=${accounts[0]}`)
                .then(response => response.json())
                .then(data => {
                    (data.users.length ? data.users[0] : handleSignup(accounts[0]))
                }).catch((error) => {
                    console.log('Since the server is currently busy, account creation / confirmation will be sent next time.')
                })
        } catch (error: any) {
            if (error.code === 4001) {
                console.log('User rejected request');
            }
            console.error(error);
        }
    }

    const disconnectWallet = async () => {
        setChainId('');
        setWalletAddress('');
        setWalletProvider('');
        setAccountBalance('');
        console.log('logout stdone donate server >_<');
    }

    const isAccountBalance = async () => {
        if (!walletAddress || !chainId) {
            connectWallet(walletProvider);
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(0);
        const contract = new ethers.Contract(`${import.meta.env.VITE_DONATE_CONTRACT_ADDRESS}`, Donate.abi, signer);
        try {
            const balance = (await contract.getAccountBalance()).toString();
            const finalBalance = (balance > 0 ? (balance / (10 ** 18)) : balance)
            setAccountBalance(finalBalance);
            if (walletAddress > 0) {
                fetch(`${import.meta.env.VITE_API_URL}/user/updateIsContract?publicAddress=${walletAddress}`, {
                    method: 'PUT'
                }).catch((error: any) => {
                    return;
                })
            } else {
                return;
            }
        } catch (error: any) {
            if (error.code === 4001) {
                console.log(error.message)
            }
            setAccountBalance(-1);
        }
    }

    const CreateAccount = async () => {
        if (!walletAddress || !chainId) {
            connectWallet(walletProvider);
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(0);
        const contract = new ethers.Contract(`${import.meta.env.VITE_DONATE_CONTRACT_ADDRESS}`, Donate.abi, signer);
        try {
            let tx: ContractTransaction = await contract.CreateAccount();
            await tx.wait();
            await isAccountBalance();
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const handleSignup = async (publicAddress: string) => {
        console.log('アカウント作成');
        fetch(`${import.meta.env.VITE_API_URL}/user/create?publicAddress=${publicAddress}`, {
            method: 'POST'
        }).then(response => response.json());
    }

    const Deposit = async (username: string, amount: ethers.BigNumber, tokenAddress: string, tokenDecimals: number) => {
        if (!walletAddress || !chainId) {
            connectWallet(walletProvider);
        }
        try {
            let publicAddress: string = ''
            await fetch(`${import.meta.env.VITE_API_URL}/user/findUsername?username=${username}`, {
                method: 'GET'
            })
            .then(data => data.json())
            .then(data => {
                publicAddress = data.users[0].publicAddress;
            }).catch((error: any) => {
                return;
            })
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner(0);
            const TokenContract = new ethers.Contract(tokenAddress, ERC20.abi, signer);
            let tx: ContractTransaction = await TokenContract.approve(`${import.meta.env.VITE_DONATE_CONTRACT_ADDRESS}`, ethers.constants.MaxUint256)
            await tx.wait();
            const DonateContract = new ethers.Contract(`${import.meta.env.VITE_DONATE_CONTRACT_ADDRESS}`, Donate.abi, signer);
            console.log(publicAddress)
            tx = await DonateContract.Deposit(publicAddress, tokenAddress, amount);
            await tx.wait();
            console.log('決済が終了しました')
        } catch (error: any) {
            return;
        }
        return;
    }

    const handleSignMessage = async (
        publicAddress: string | undefined,
        nonce: string | undefined
    ) => {
        const { ethereum } = window;
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signature = await signer.signMessage(
            `I am signing my one-time nonce: ${nonce}`
        )
        handleAuthenticate(publicAddress, signature);
    }

    const handleAuthenticate = async (
        publicAddress: string | undefined,
        signature: string | undefined
    ) => {
        await fetch(`${import.meta.env.VITE_API_URL}/auth/authorization`, {
            body: JSON.stringify({publicAddress, signature}),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        })
            .then((response) => response.json())
            .then((data) => {
                setAccessToken(data.access_token)
            })
    }

    if (typeof window !== 'undefined') {
        useEffect(() => {
            let provider: any;
            if (walletProvider === 'metamask') {
                const {isInstalled, returnProvider} = isMetamaskInstalled();
                if (!isInstalled) {
                    console.log('Please install Metamask')
                    disconnectWallet();
                }
                provider = returnProvider;
            } else if (walletProvider === 'coinbase') {
                const {isInstalled, returnProvider} = isCoinbaseWalletInstalled();
                if (!isInstalled) {
                    console.log('Please install Coinbase Wallet')
                    disconnectWallet();
                }
                provider = returnProvider;
            }

            if (provider && provider.on) {
                if (provider.request({method: 'eth_requestAccounts'})[0]) {
                    setWalletAddress(provider.request({method: 'eth_requestAccounts'})[0]);
                }

                if (provider.chainId) {
                    setChainId(provider.chainId);
                }

                const handleChainChanged = async (chainId: string) => {
                    console.log('チェーン切り替え');
                    provider.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x7a69' }]
                    })
                    setWalletAddress(provider.request({method: 'eth_requestAccounts'})[0])
                }

                const handleAccountsChanged = async (accounts: string[]) => {
                    if (accounts.length > 0) {
                        setAccessToken('');
                        setWalletAddress('');
                        setChainId('');
                        setChainId('');
                        setWalletAddress('');
                        setWalletProvider('');
                    }
                };

                provider.on('chainChanged', handleChainChanged);
                provider.on('accountsChanged', handleAccountsChanged);
            }
        }, [walletAddress, chainId]);
    }

    return {
        walletAddress,
        chainId,
        connectWallet,
        disconnectWallet,
        isAccountBalance,
        accountBalance,
        CreateAccount,
        Deposit,
        handleSignMessage,
    }
}