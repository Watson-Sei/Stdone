import {Disclosure, Popover} from '@headlessui/react';
import { XIcon, MenuIcon } from '@heroicons/react/outline';
import Logo from '../assets/images/favicon.svg';
import { useNavigate } from 'react-router-dom';
import {useState} from 'react';
import Modal from 'react-modal';
import Metamask from '../assets/images/metamask.svg';
import Coinbase from '../assets/images/coinbase.svg';
import { useWallet } from '../hooks/useWallet';

const customModalStyle = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
}

export default function Header() {
    const navigate = useNavigate();
    const [modalIsOpen, setIsOpen] = useState(false);
    const {connectWallet, walletAddress} = useWallet();

    const { disconnectWallet } = useWallet();

    return (
        <Disclosure as="nav" className="bg-white">
            {({open}) => (
                <>
                    <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
                        <div className='relative flex items-center justify-between h-16'>
                            <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
                                {/* Mobile menu button */}
                                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400">
                                    <span className='sr-only'>Open main menu</span>
                                    {open ? (
                                        <XIcon className='block h-6 w-6' aria-hidden="true" />
                                    ) : (
                                        <MenuIcon className='block h-6 w-6' aria-hidden="true" />
                                    )}
                                </Disclosure.Button>
                            </div>
                            <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                                <a onClick={() => navigate("/")} className="flex-shrink-0 flex items-center cursor-pointer">
                                    <img
                                        className="block lg:hidden h-8 w-auto"
                                        src={Logo}
                                        alt="pay air"
                                    />
                                    <img
                                        className="hidden lg:block h-8 w-auto"
                                        src={Logo}
                                        alt="pay air"
                                    />
                                    <div className="text-xl text-gray-800">
                                        Stdone
                                    </div>
                                </a>
                                <div className='hidden sm:block sm:ml-auto'>
                                    <div className='flex space-x-4'>
                                        <a
                                            href='/'
                                            className='text-gray-800 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                                            aria-current={undefined}
                                        >
                                            使い方
                                        </a>
                                        <a
                                            href='/'
                                            className='text-gray-800 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium'
                                            aria-current={undefined}
                                        >
                                            対応通貨
                                        </a>
                                        {walletAddress ? (
                                            <>
                                                <a
                                                    onClick={() => navigate('/profile')}
                                                    className='text-white bg-blue-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
                                                    aria-current={undefined}
                                                >
                                                    Profile
                                                </a>
                                                <a
                                                    onClick={() => disconnectWallet()}
                                                    className='text-white bg-blue-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
                                                    aria-current={undefined}
                                                >
                                                    Logout
                                                </a>
                                            </>
                                        ) : (
                                            <>
                                                <a
                                                    onClick={() => setIsOpen(true)}
                                                    className='text-white bg-blue-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
                                                    aria-current={undefined}
                                                >
                                                    Connect Wallet
                                                </a>
                                            </>
                                        )}
                                        <Modal
                                            isOpen={modalIsOpen} 
                                            onRequestClose={() => setIsOpen(false)}
                                            style={customModalStyle}
                                            ariaHideApp={false}
                                        >
                                            <div className='w-96'>
                                                <div className='flex justify-between'>
                                                    <div className='font-bold'>
                                                        Connect Wallet
                                                    </div>
                                                    <div className='' onClick={() => setIsOpen(false)}>
                                                        <XIcon className='block h-6 w-6' aria-hidden="true" />
                                                    </div>
                                                </div>
                                                <div className='w-full border-2 p-4 my-4 bg-gray-200 rounded-lg'>
                                                    ウォレットを接続することにより、あなたはStdoneのサービス規約に同意したものとします。
                                                </div>
                                                <div onClick={() => {
                                                        connectWallet('metamask')
                                                        setIsOpen(false)
                                                    }} 
                                                    className='flex justify-between items-center text-lg my-2 p-2 border-2 rounded-lg cursor-pointer hover:border-sky-900'
                                                >
                                                    <div className='font-bold'>
                                                        MetaMask
                                                    </div>
                                                    <img src={Metamask} alt='' className='w-10 h-10' />
                                                </div>
                                                <div onClick={() => {
                                                        connectWallet('coinbase')
                                                        setIsOpen(false)
                                                    }} 
                                                    className='flex justify-between items-center text-lg my-2 p-2 border-2 rounded-lg cursor-pointer hover:border-sky-900'
                                                >
                                                    <div className='font-bold'>
                                                        Coinbase Wallet
                                                    </div>
                                                    <img src={Coinbase} alt='' className='w-10 h-10' />
                                                </div>
                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </Disclosure>
    )
}