import { useEffect } from 'react';
import { useState } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet';

export const IsAccount = () => {
    let params = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(false);

    const Suspend = () => {
        if (user) {
            return <Outlet />
        } else {
            return <Navigate to="/" />
        }
    }

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/user/findUsername?username=${params.id}`, {
            method: 'GET'
        })
        .then(data => data.json())
        .then(data => {
            if (data.users[0].isContract) {
                setUser(true)
            } else {
                setUser(false)
            }
            return setLoading(false);
        })
    }, [])

    return !loading ? (
        <Suspend />
    ) : (
        <div>Loading Now</div>
    )
}