import React from 'react';
import { useCookies } from 'react-cookie';
import { useAuthContext } from '../../context/AuthContext';

export const Home: React.VFC = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [,, removeCookie] = useCookies();
    const { user, setUser } = useAuthContext();

    const handleLogout = async () => {
        removeCookie('access_token');
        setUser(undefined);
        window.location.href = '/signin';
    }

    return (
        <React.Fragment>
            <h1>Welcome to Home Page {user ? user.username : 'none' } さん</h1>
            <button onClick={() => handleLogout()}>ログアウト</button>
        </React.Fragment>
    )
}