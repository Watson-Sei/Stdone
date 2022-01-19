import {Disclosure, Popover} from '@headlessui/react';
import { XIcon, MenuIcon } from '@heroicons/react/outline';
import Logo from '../assets/images/favicon.svg';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
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
                                        <a
                                            onClick={() => navigate("/login")}
                                            className='text-white bg-blue-600 px-3 py-2 rounded-md text-sm font-medium cursor-pointer'
                                            aria-current={undefined}
                                        >
                                            Login
                                        </a>
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