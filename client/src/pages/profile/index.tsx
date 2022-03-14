import {ethers} from 'ethers';
import { useState } from 'react';
import { useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { CogIcon } from '@heroicons/react/outline';
import { useRecoilState } from 'recoil';
import { accessTokenState } from '../../stores/atoms';
import { SubmitHandler, useForm } from "react-hook-form";

type Input = {
    username: string;
    email: string;
};

export default function Profile() {
    const { register, handleSubmit, formState: {errors} } = useForm<Input>({
        mode: 'onChange',
        criteriaMode: 'all',
        shouldFocusError: false
    });

    const {isAccountBalance, walletAddress, chainId, accountBalance, CreateAccount, handleSignMessage} = useWallet();
    const [username, setUsername] = useState<string>('null');
    const [email, setEmail] = useState<string>('未登録');
    const [nonce, setNonce] = useState<string | undefined>('');
    const [edit, setEdit] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

    useEffect(() => {
        isAccountBalance();
        fetch(`${import.meta.env.VITE_API_URL}/user/findPublicAddress?publicAddress=${walletAddress}`)
            .then(response => response.json())
            .then(data => {
                setUsername(data.users[0].username);
                if (data.users[0].nonce) {
                    setNonce(data.users[0].nonce);
                }
                if (data.users[0].email) {
                    setEmail(data.users[0].email);
                }
            })
    }, [walletAddress, chainId])

    const Edit = async() => {
        console.log('Edit')
        if (accessToken) {
            // 有効かどうかを確認し有効であればeditをtrueに変更
            // 無効であればedit&accessTokenをfalse&nullに変更
            console.log('check')
            await fetch(`${import.meta.env.VITE_API_URL}/auth/valid`, {
                body: JSON.stringify({access_token: accessToken}),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            }).then((response) => {
                if (response.ok) {
                    setEdit(true);
                    return;
                } else {
                    setAccessToken('');
                    setEdit(false);
                }
            }).catch((error) => {
                setAccessToken('');
                setEdit(false);
                return;
            })
        } else {
            await handleSignMessage(walletAddress, nonce)
        }
    }

    const Save: SubmitHandler<Input> = async (data) => {
        await fetch(`${import.meta.env.VITE_API_URL}/user/updateProfile`, {
            method: 'PUT',
            body: JSON.stringify({
                username: data.username,
                email: data.email
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        })
            .then(response => response.json())
            .then(data => {
                setUsername(data.username);
                setEmail(data.email);
                setNonce(data.nonce);
                setEdit(false);
            }).catch((error) => {
                console.log(error.message);
            })
    }

    return (
        <>
            <div className="w-full px-8">
                {/* ユーザー情報 */}
                <div className="w-full max-w-screen-sm mx-auto mt-10">
                    <div className='flex justify-between'>
                        <div className="text-xl font-bold">
                            基本情報
                        </div>
                        <CogIcon className='w-5' onClick={() => Edit()}/>
                    </div>
                    {!edit ? (
                        <div className="w-full bg-gray-200 p-8 rounded-md">
                            <span className="text-xl font-bold text-gray-800">UserName: </span>{username}<br/>
                            <span className="text-xl font-bold text-gray-800">E-mail: </span>{email}
                        </div>
                    ) : (
                        <div className='w-full bg-gray-200 p-8 rounded-md'>
                            <form onSubmit={handleSubmit(Save)}>
                                <label htmlFor='username' className='block mb-2 text-sm font-medium text-gray-900'>Your name</label>
                                <input type="text" id='username' defaultValue={username} {...register("username", {
                                    required: true,
                                    maxLength: 20,
                                })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='山田　太郎' />
                                {errors.username?.types?.required && <span className='text-rose-600'>入力必須</span>}
                                {errors.username?.types?.maxLength && <span className='text-rose-600'>文字制限</span>}
                                <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900'>Your email</label>
                                <input type="email" id="email" defaultValue={email} {...register("email", {
                                    required: true,
                                    maxLength: 30,
                                    pattern: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
                                })} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder='sample@gmail.com' />
                                {errors.email?.types?.required && <span className='text-rose-600'>入力必須</span>}
                                {errors.email?.types?.pattern && <span className='text-rose-600'>メールアドレスを正しく入力しなおしてください。</span>}
                                <br />
                                <button type="submit" className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Save</button>
                            </form>
                        </div>
                    )}
                </div>
                {/* ウォレット */}
                <div className="w-full max-w-screen-sm mx-auto mt-10">
                    <div className="text-xl font-bold">
                        Wallet
                    </div>
                    <div className="w-full bg-gray-200 p-8 rounded-md overflow-auto">
                        <span>{walletAddress}</span>
                    </div>
                </div>
                <div className='w-full max-w-screen-sm mx-auto mt-2 text-left'>
                    設定したアドレス口座の引き出し金額が送金されます。
                </div>
                {/* 収益・口座 */}
                <div className="w-full max-w-screen-sm mx-auto mt-10">
                    <div className="text-xl font-bold">
                        収益
                    </div>
                    <div className="w-full bg-gray-200 p-8 rounded-md">
                        {accountBalance === -1 ? (
                            <>
                                <button onClick={() => CreateAccount()}>
                                    口座開設申請
                                </button>
                            </>
                        ) : (
                            <>
                                <div className='w-full max-w-xs mx-auto sm:px-5 bg-blue-400 flex justify-between p-3'>
                                    <div className='text-xl'>
                                        総額
                                    </div>
                                    <div className=''>
                                        {accountBalance}
                                    </div>
                                </div>
                                <div className='w-full max-w-xs mx-auto sm:px-5 bg-gray-400 flex justify-between py-1 px-3'>
                                    <div className='text-md'>
                                        手数料
                                    </div>
                                    <div className=''>
                                        17%
                                    </div>
                                </div>
                                <div className='w-full max-w-xs mx-auto sm:px-5 bg-gray-500 flex justify-between py-1 px-3'>
                                    <div className='text-md'>
                                        振り込み額
                                    </div>
                                    <div className=''>
                                        {accountBalance * 83 / 100}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}