import React, { useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation } from 'react-router';


const twitchClientId = process.env.REACT_APP_TWITCH_CLIENT_ID;
const youtubeClientId = process.env.REACT_APP_YOUTUBE_CLIENT_ID;
const twitchRedirectUri = `http://localhost:3000/signin?id=twitch`
const youtubeRedirectUri = `http://localhost:3000/signin?id=youtube`

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

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
            <h1>ユーザーログイン</h1>
            <button onClick={() => handleTwitchLogin()}>Sign In with Twitch</button>
            <button onClick={() => handleYoutubeLogin()}>Sign In with Youtube</button>
        </React.Fragment>
    )
}