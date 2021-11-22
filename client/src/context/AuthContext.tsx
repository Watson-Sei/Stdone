import React, { createContext, useState, useContext, useEffect, FC } from 'react';
import { useCookies } from 'react-cookie';

export interface User {
    id?: number;
    twitch_id?: string;
    youtube_id?: string;
    email?: string;
    username?: string;
}

export interface IAuth {
    user: User | undefined,
    loading: boolean,
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
}

export const AuthContext = createContext({} as IAuth);
export const useAuthContext = () => useContext(AuthContext);

interface Props {
}

export const AuthProvider: FC<Props> = ({ children, ...props }) => {
    const [user, setUser] = useState<User | undefined>();
    const [loading, setLoading] = useState<boolean>(true);
    const [cookies,, removeCookie ] = useCookies();
    const value = {
        user,
        loading,
        setUser
    };

    useEffect(() => {
        if (cookies.access_token !== undefined) {
            fetch('http://localhost:5000/auth/me', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Authorization': `Bearer ${cookies.access_token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.user)
                setUser(data.user)
            })
            .catch(err => {
                setUser(undefined)
                removeCookie('access_token')
            })
        } else {
            setUser(undefined)
            removeCookie('access_token')
        }
        console.log('Cookieチェック', user)
        setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
};