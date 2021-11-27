import React from 'react';
import { useAuthContext } from '../../context/AuthContext';

export const Profile: React.VFC = () => {
    
    const { user } = useAuthContext();

    return (
        <div>
            <h1>This page is my profile information.</h1>
            <p>It can only be viwed by me.</p>
            <p>UserName: {user ? user.username : 'none'}さん</p>
        </div>
    )
}