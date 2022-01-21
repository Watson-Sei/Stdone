import {ethers} from 'ethers';
import { useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';

export default function Profile() {

    const {isAccountBalance, walletAddress, chainId, accountBalance, openAccount} = useWallet();

    useEffect(() => {
        isAccountBalance();
    }, [walletAddress, chainId])

    return (
        <>
            <div className="w-full px-8">
                {/* ユーザー情報 */}
                <div className="w-full max-w-screen-sm mx-auto mt-10">
                    <div className="text-xl font-bold">
                        基本情報
                    </div>
                    <div className="w-full bg-gray-200 p-8 rounded-md">
                        <span className="text-xl font-bold text-gray-800">UserName: </span>NullName<br/>
                        <span className="text-xl font-bold text-gray-800">E-mail: </span>abc@gmail.com
                    </div>
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
                                <button onClick={() => openAccount()}>
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