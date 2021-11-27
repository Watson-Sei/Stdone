import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';
import Web3 from 'web3';
import { useCookies } from 'react-cookie';

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

export const Profile: React.VFC = () => {
    
    const { user, setUser } = useAuthContext();
    const [cookies,,] = useCookies();

    const ConnectMetamaskWallet = async () => {
        const web3 = new Web3(Web3.givenProvider);
        const accounts = await web3.eth.requestAccounts();
        // 取得したアドレスをユーザーのデータベースに保存する
        fetch(`http://localhost:5000/auth/me/wallet`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${cookies.access_token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({address: accounts[0]})
        })
        .then(response => response.json())
        .then(data => {
            setUser(data.user)
        })
    }

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
                            {user.address}
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
                <Note>※設定されているウォレットに引き出し金が送金されます。</Note>
            </BasicInformation>
        </AllContentBox>
    )
}