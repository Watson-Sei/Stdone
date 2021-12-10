import React, {useEffect, useState} from 'react';
import { useAuthContext } from '../../context/AuthContext';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useWallet } from '../../hooks/use-web3';
import Donate from '../../contracts/Donate.json';
import {ContractTransaction, ethers} from 'ethers';

const AllContentBox = styled(Box)`
    width: 100%;
    margin: 0 auto;
    margin-top: 80px;
`;

const BasicInformation = styled.div`
    width: 98%;
    margin: 0 auto;
`;

const Title = styled.div`
    font-size: 18px;
    font-weight: bold;
    opacity: 80%;
    margin-left: 10px;
    margin-bottom: 5px;

    @media (max-width: 500px) {
        font-size: 16px;
    }
`;

const WalletAddress = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 10px;
`;

const ContentBox = styled.div`
    width: 100%;
    background: #F5F6FA;
    border-radius: 30px;
    height: 150px;

    @media (max-width: 500px) {
        height: 140px;
    }

    &.metamask {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &.revenue {
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

const RevenueContent = styled.div`
    width: 400px;
    height: 112px;
    background: gray;
    font-size: 32px;

    @media (max-width: 520px) {
        width: 300px;
    }
`;

const Content = styled(Typography)`
    font-size: 20px;
    font-weight: bold;
    padding: 5px 0;
    margin-left: 20px;
    opacity: 80%;

    @media (max-width: 500px) {
        font-size: 16px;
    }

    &.active {
        padding-top: 40px;
    }
`;

const ButtonDisableStyle = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    padding: 0;
    appearance: none;
`;

const MetamaskConnectButton = styled.div`
    width: 414px;
    height: 48px;
    box-shadow: 2px 2px 4px gray;
    border-radius: 10px;
    display: flex;
    align-items: center;
`;

const MetamaskLogo = styled.img`
    width: 24px;
    height: 24px;
    padding: 12px;
    margin-left: 25px;
`;

const MetamaskName = styled(Typography)`
    margin: 0 35px;
`;

const Note = styled.span`
    font-size: 14px;
    opacity: 60%;
`;

const TotalContent = styled.div`
    width: 100%;
    height: 52px;
    background: #2775CA;
    display: flex;
`;

const CommissionContent = styled.div`
    width: 100%;
    height: 30px;
    background: #828282;
    display: flex;
`;

const WithdrawalContent = styled.div`
    width: 100%;
    height: 30px;
    background: #353535;
    display: flex;
`;

const RevenueTitle = styled.div`
    width: 150px;
    height: 52px;
    font-size: 18px;
    text-align: left;
    line-height: 52px;
    color: white;
    padding-left: 20px;

    @media (max-width: 520px) {
        width: 140px;
    }

    &.commission {
        height: 30px;
        font-size: 16px;
        line-height: 30px;
    }
`;

const RevenueAmount = styled.div`
    width: 250px;
    height: 52px;
    font-size: 24px;
    text-align: right;
    line-height: 52px;
    color: white;
    padding-right: 20px;

    @media (max-width: 520px) {
        width: 160px;
    }

    &.commission {
        height: 30px;
        font-size: 18px;
        line-height: 30px;
    }
`;

interface Window {
    ethereum: any;
}

declare const window: Window;

export const Profile: React.VFC = () => {
    
    const { user, setUser } = useAuthContext();
    const [cookies,,] = useCookies();
    const {connectWeb3, walletAddress} = useWallet();
    const [accountBalance, setAccountBalance] = useState<number | undefined>(undefined);

    // アドレスの登録
    const ConnectMetamaskWallet = async () => {
        await connectWeb3();
        // 取得したアドレスをユーザーのデータベースに保存する
        fetch(`http://localhost:5000/auth/me/wallet`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${cookies.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({address: walletAddress})
        })
        .then(response => response.json())
        .then(data => {
            setUser(data.user)
        })
    }

    // 口座開設
    const ContractOpenAccount = async () => {
        await connectWeb3();
        if (user?.address?.toUpperCase() === walletAddress.toUpperCase()) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner(0);
            const contract = new ethers.Contract("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", Donate.abi, signer);
            try {
                let tx: ContractTransaction = await contract.Opening()
                await tx.wait()
                console.log('口座作成が成功しました。')
                // 問題なく口座が開設されたのでis_accountをtrueに更新する
                fetch(`http://localhost:5000/auth/me/account`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${cookies.access_token}`,
                        'Content-Type': 'application/json'
                    },
                })
                .then(response => response.json())
                .then(async (data) => {
                    setUser(data.user)
                    try {
                        const balance = (await contract.getVirtualAccountBalance()).toString();
                        const finalBalance = (balance > 0 ? (balance / (10 ** 18)) : balance)
                        setAccountBalance(finalBalance);
                    } catch (e: any) {
                        console.log('取得に失敗')
                        setAccountBalance(undefined);
                    } 
                })
            } catch (error: any) {
                // 処理を取り消す
                console.log('口座作成に失敗しました。')
                console.log('error:',error.message)
            }
        }
    }

    // 初回のみ実行
    useEffect(() => {
        (async() => {
            connectWeb3();
            if (user?.address?.toUpperCase() === walletAddress.toUpperCase() && user.is_account) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner(0);
                const contract = new ethers.Contract("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9", Donate.abi, signer);
                try {
                    const balance = (await contract.getVirtualAccountBalance()).toString()
                    const finalBalance = (balance > 0 ? (balance / (10 ** 18)) : balance)
                    setAccountBalance(finalBalance);
                } catch (error: any) {
                    setAccountBalance(undefined)
                }
            }
        })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletAddress]);

    return (
        <AllContentBox>
            <BasicInformation>
                <Title>基本情報</Title>
                <ContentBox>
                        <Content className="active">E-Mail: {user ? user.email : 'none'}</Content>
                        <Content>UserName: {user ? user.username : 'none'}</Content>
                </ContentBox>
            </BasicInformation>
            <div style={{ marginTop: 20 }} />
            <BasicInformation>
                <Title>Wallet情報</Title>
                <ContentBox className="metamask">
                    {user?.address ? (
                        <>
                            <WalletAddress>
                                {user.address}
                            </WalletAddress>
                        </>
                    ) : (
                        <>
                            <ButtonDisableStyle onClick={() => ConnectMetamaskWallet()}>
                                <MetamaskConnectButton>
                                    <MetamaskLogo src={`${process.env.PUBLIC_URL}/metamask.svg`} />
                                    <MetamaskName>
                                        Connect with MetaMask Wallet
                                    </MetamaskName>
                                </MetamaskConnectButton>
                            </ButtonDisableStyle>
                        </>
                    )}
                </ContentBox>
                <Note>※設定されているウォレットに引き出し金が送金されます。<br/>
                ※アドレスの変更は運営までご連絡ください。変更時は現在の口座残高は無効になります。</Note>
            </BasicInformation>
            {user?.address ? (
                <><div style={{ marginTop: 20 }} /><BasicInformation>
                    <Title>収益</Title>
                    {user.is_account === false ? (
                        <>
                            <button onClick={() => ContractOpenAccount()}>口座開設</button>
                        </>
                    ) : (
                        <>
                        {user.is_account === true ? (
                            <>
                                {accountBalance ? (
                                    <>
                                        <ContentBox className="revenue">
                                            <RevenueContent>
                                                <TotalContent>
                                                    <RevenueTitle>総額</RevenueTitle>
                                                    <RevenueAmount>{accountBalance}</RevenueAmount>
                                                </TotalContent>
                                                <CommissionContent>
                                                    <RevenueTitle className="commission">手数料</RevenueTitle>
                                                    <RevenueAmount className="commission">17%</RevenueAmount>
                                                </CommissionContent>
                                                <WithdrawalContent>
                                                    <RevenueTitle className="commission">振り込み額</RevenueTitle>
                                                    <RevenueAmount className="commission">{accountBalance * 83 / 100}</RevenueAmount>
                                                </WithdrawalContent>
                                            </RevenueContent>
                                        </ContentBox>
                                        <Note>
                                            ※振り込み額とは総額から手数料を引いた実際に受け取れる金額です。
                                        </Note>
                                    </>
                                ) : (
                                    <>
                                        <ContentBox className="metamask">
                                            <p>収益額を正常に取得できませんでした、恐れ入りますがブラウザのリロードを推奨します</p>
                                        </ContentBox>
                                    </>
                                )}
                            </>
                        ) : (
                            <ContentBox className="metamask">
                                <p>上記のWallet情報のアドレスにMetamask接続を切り替えてください</p>
                            </ContentBox>
                        )} 
                        </>
                    )} 
                </BasicInformation></>
            ): (
                <>
                </>
            )}
        </AllContentBox>
    )
}