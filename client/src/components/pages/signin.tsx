import React, { useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router';
import {
    Box,
    Typography
} from '@mui/material';
import styled from '@emotion/styled';

const twitchClientId = process.env.REACT_APP_TWITCH_CLIENT_ID;
const youtubeClientId = process.env.REACT_APP_YOUTUBE_CLIENT_ID;
const twitchRedirectUri = `http://localhost:3000/signin?id=twitch`
const youtubeRedirectUri = `http://localhost:3000/signin?id=youtube`

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

const Content = styled(Box)`
    width: 1024px;
    padding: 50px;
    display: flex;
    justify-content: space-around;
    margin: 0 auto;
    margin-top: 150px;

    @media (max-width: 1150px) {
        display: block;
        width: 700px;
        margin-top: 30px;
        padding: 20px;
    }

    @media (max-width: 775px) {
        display: block;
        width: 500px;
        margin-top: 30px;
        padding: 0;
    }

    @media (max-width: 600px) {
        display: block;
        width: 400px;
        margin-top: 30px;
        padding: 0;
    }

    @media (max-width: 420px) {
        display: block;
        width: 320px;
        margin-top: 40px;
        padding: 0;
    }
`;

const BackgroundImage = styled.img`
    width: 600px;

    @media (max-width: 1150px) {
        width: 100%;
    }
`;

const ButtonBox = styled.div`
    width: 414px;
    margin: 110px;

    @media (max-width: 1150px) {
        margin: 0 auto;
    }

    @media (max-width: 420px) {
        width: 314px;
        margin: 0 auto;
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

const SigninButton = styled.div`
    width: 400px;
    height: 48px;
    margin: 12px 0;
    display: flex;
    align-items: center;
    padding-left: 14px;

    @media (max-width: 420px) {
        width: 300px;
    }
`;

const Logo = styled.img`
    width: 27px;
    height: 27px;
`;

const ButtonText = styled(Typography)`
    width: 200px;
    font-size: 18px;
    color: white;
    display: flex;
    align-items: center;
    margin: 0 auto;
`;

export const Signin: React.VFC = () => {
    const [, setCookie] = useCookies();
    let query = useQuery();

    const handleTwitchLogin = async () => {
        window.location.href = `https://id.twitch.tv/oauth2/authorize?client_id=${twitchClientId}&redirect_uri=${twitchRedirectUri}&response_type=code&scope=user:read:email`;
    }

    const handleYoutubeLogin = async () => {
        window.location.href = `https://accounts.google.com/o/oauth2/auth?client_id=${youtubeClientId}&redirect_uri=${youtubeRedirectUri}&response_type=code&scope=https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email`
    }

    useEffect(() => {
        if (query.get('code') && query.get('id')) {
            fetch(`http://localhost:5000/auth/${query.get('id')}/callback?code=${query.get('code')}`, {
                method: 'GET',
                mode: 'cors'
            })
            .then(response => response.json())
            .then(data => {
                setCookie('access_token', data.accessToken)
                window.location.href = '/'
            })
            .catch(err => {
                window.location.href = '/signin'
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <Content sx={{ flexGrow: 1 }}>
                <BackgroundImage src={`${process.env.PUBLIC_URL}/login-image.png`} alt="ethereum official" />
                <ButtonBox>
                    <p style={{ textAlign: 'center', pointerEvents: 'none' }}>Log in or sign up</p>
                    <div>
                        <ButtonDisableStyle onClick={() => handleTwitchLogin()}>
                            <SigninButton style={{ backgroundColor: '#9146FF' }}>
                                <Logo src={`${process.env.PUBLIC_URL}/twitch.svg`} alt="twitch logo" />
                                <ButtonText>
                                    Continue with Twitch
                                </ButtonText>
                            </SigninButton>
                        </ButtonDisableStyle>
                        <ButtonDisableStyle onClick={() => handleYoutubeLogin()}>
                            <SigninButton style={{ backgroundColor: '#FF0000' }}>
                                <Logo src={`${process.env.PUBLIC_URL}/youtube.svg`} alt="youtube logo" />
                                <ButtonText>
                                    Continue with Youtube
                                </ButtonText>
                            </SigninButton>
                        </ButtonDisableStyle>
                    </div>
                </ButtonBox>
            </Content>
        </React.Fragment>
    )
}