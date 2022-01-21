import { ContractTransaction, ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import {walletAddressState, chainIdState, walletProviderState, accountBalanceState} from '../stores/atoms';
import Donate from '../contracts/Donate.json';

interface Window {
    ethereum: any;
}

declare const window: Window;

export const useWallet = () => {
    const [walletAddress, setWalletAddress] = useRecoilState(walletAddressState);
    const [chainId, setChainId] = useRecoilState(chainIdState);
    const [walletProvider, setWalletProvider] = useRecoilState(walletProviderState);
    const [accountBalance, setAccountBalance] = useRecoilState(accountBalanceState);

    const connectWallet = async (detect: string) => {
        const {ethereum} = window;
        let provider: any;
        setWalletProvider(detect);
        if (detect === "metamask") {
            provider = ethereum.providers.find((p: any) => p.isMetaMask)
        } else if (detect === "coinbase") {
            provider = ethereum.providers.find((p: any) => p.isCoinbase)
        }

        try {
            const accounts = await provider.request({method: 'eth_requestAccounts'})
            setWalletAddress(accounts);
            setChainId(provider.chainId);
        } catch (error: any) {
            if (error.code === 4001) {
                console.log('User rejected request')
            }
            console.error(error)
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
        const contract = new ethers.Contract("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", Donate.abi, signer);
        try {
            const balance = (await contract.getVirtualAccountBalance()).toString();
            const finalBalance = (balance > 0 ? (balance / (10 ** 18)) : balance)
            setAccountBalance(finalBalance);
        } catch (error: any) {
            if (error.code === 4001) {
                console.log(error.message)
            }
            setAccountBalance(-1);
        }
    }

    const openAccount = async () => {
        if (!walletAddress || !chainId) {
            connectWallet(walletAddress);
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(0);
        const contract = new ethers.Contract("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", Donate.abi, signer);
        try {
            let tx: ContractTransaction = await contract.Opening()
            await tx.wait()
            await isAccountBalance();
            isAccountBalance();
        } catch (error: any) {
            console.log(error.message)
        }
    }

    if (typeof window !== 'undefined') {
        useEffect(() => {
            const {ethereum} = window;
            let provider: any;

            if (walletProvider === "metamask") {
                provider = ethereum.providers.find((p: any) => p.isMetaMask)
            } else if (walletProvider === "coinbase") {
                provider = ethereum.providers.find((p: any) => p.isCoinbaseWallet)
            }

            if (provider && provider.on) {
                if (provider.request({method: 'eth_requestAccounts'})[0]) {
                    setWalletAddress(provider.request({method: 'eth_requestAccounts'})[0]);
                }

                if (provider.chainId) {
                    setChainId(provider.chainId);
                }

                const handleChainChanged = async (chainId: string) => {
                    setChainId(chainId);
                    setWalletAddress(provider.request({method: 'eth_requestAccounts'})[0])
                }

                const handleAccountsChanged = async (accounts: string[]) => {
                    if (accounts.length > 0) {
                        setWalletAddress(accounts[0]);
                        setChainId(provider.chainId);
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
        openAccount
    }
}