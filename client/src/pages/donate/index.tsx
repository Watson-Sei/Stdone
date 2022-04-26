import { useState } from "react"
import { ChevronDownIcon, XIcon } from '@heroicons/react/outline';
import Modal from 'react-modal';
import { useEffect } from "react";
import { useWallet } from "../../hooks/useWallet";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";

const customStyles = {
    content: {
      top: '20%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: 0,
    },
  };

export default function Donate(): JSX.Element {

    let params = useParams();

    const { walletAddress, Deposit } = useWallet();

    const [name, setName] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [kinds, setKinds] = useState<{symbol: string; icon: string; address: string; decimals: number; min: number} | null>(null);
    const [list, setList] = useState<any[]>([]);
    const [modalIsOpen, setIsOpen] = useState(false);

    const openModal = async() => {
        setIsOpen(true);
    }

    const closeModal = async() => {
        setIsOpen(false);
    }

    const setToken = async(info: {symbol: string; icon: string; address: string; decimals: number; min: number}) => {
        setKinds(info);
        setAmount(info.min);
        closeModal();
    }

    const pay = async() => {
        if (!kinds && !amount) {
            // console.log('Please Select Token');
            alert('Please Select Token');
            return;
        }
        if (amount < kinds!.min) {
            // console.log('最低金額以下になっています');
            alert('最低金額以下になっています');
            return;
        }
        // 最低amount数をtokenAPIから
        await Deposit(`${params.id}`, ethers.utils.parseUnits(`${amount}`, kinds!.decimals), kinds!.address, kinds!.decimals)
    }

    const PayButton = () => {
        if (walletAddress) {
            if (amount > 0 && kinds) {
                return (
                    <div className="py-2">
                        <button type="button" onClick={() => pay()} className="w-full text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center dark:focus:ring-gray-500 mr-2 mb-2">
                            <p className="w-full text-center">Pay with {kinds.symbol}</p>
                        </button>
                    </div>
                );
            }
            return <></>
        }
        return <></>
    }

    useEffect(() => {
        
        fetch(`${import.meta.env.VITE_API_URL}/token/list`, {
            method: 'GET'
        })
        .then(data => data.json())
        .then(data => {
            setList(data.TokenInfo);
        })
    }, []);

    return (
        <>
            <div className="w-full max-w-screen-md px-8 p-12 m-auto">
                <div className="w-full shadow-lg p-3 sm:p-12">
                    <div className="py-2 flex items-center">
                        <img className="w-20 h-20 rounded-full" src='https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Blank&facialHairType=BeardMedium&facialHairColor=Auburn&clotheType=ShirtCrewNeck&clotheColor=PastelRed&eyeType=Side&eyebrowType=DefaultNatural&mouthType=Smile&skinColor=Light' alt="" />
                        <div className="text-xl font-bold ml-5">{params.id}</div>
                    </div>
                    <div className="py-2">
                        <label htmlFor="small-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">USERNAME</label>
                        <input value={name} onChange={(event) => setName(event.target.value)} type="text" id="small-input" className="block p-2 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="山田　太郎"></input>
                    </div>
                    <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600 pt-2">AMOUNT</p>
                    <div className="py-2 px-5 bg-gray-50 rounded-lg border border-gray-300 flex items-center">
                        <input value={amount} onChange={(event) => setAmount(Number(event.target.value))} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="number"  placeholder="0.0"/>
                        <button onClick={() => openModal()} className="flex-shrink-0 flex items-center justify-between border rounded-lg px-4 py-2 shadow-md hover:bg-gray-200" type="button">
                            <img src={kinds ? kinds.icon : ''} className="w-7 mx-1" />
                            <p className="font-bold mx-1">{kinds ? kinds.symbol : 'トークン選択'}</p>
                            <ChevronDownIcon className="h-5 w-5" />
                        </button>
                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            style={customStyles}
                            contentLabel="Token List"
                            ariaHideApp={false}
                        >
                            <div className="w-80">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="text-lg">トークン選択</div>
                                    <div onClick={() => closeModal()}>
                                        <XIcon className="w-6" />
                                    </div>
                                </div>
                                <div className="w-full shadow-inner cursor-pointer">
                                    {list.map((value, index) => {
                                        return (
                                            <div onClick={() => setToken(value)} className="w-full flex items-center px-4 py-2" key={index}>
                                                <img className="w-10" src={value.icon} />
                                                <div className="pl-2 font-bold">{value.symbol}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </Modal>
                    </div>
                    <div className="py-2">
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-600">YOUR MESSAGE</label>
                        <textarea value={message} onChange={(event) => setMessage(event.target.value)} id="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Donate Message..."></textarea>
                    </div>
                    <PayButton />
                </div>
            </div>
        </>
    )
}