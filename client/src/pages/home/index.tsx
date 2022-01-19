import LgImage from '../../assets/images/image1.jpeg';
import SmallImage from '../../assets/images/image2.jpeg';

export default function Home() {
    return (
        <>
            <div className="w-full relative">
                <img src={LgImage} alt="" className='object-cover lg:h-80 sm:h-80 w-full' />
                <p className='absolute top-1/2 left-1/2 text-white text-on-img lg:text-3xl sm:text-2xl'>
                    仮想通貨で<br/>
                    もっと多くのクリエイターに寄付をしよう！
                </p>
            </div>
            <div className='w-full my-10'>
                <div className='text-2xl text-center font-bold py-6'>
                    How to Use
                </div>
                <div className='text-center w-full'>
                    <iframe className='my-0 mx-auto w-full h-96 sm:px-12 lg:px-32' width="560" height="315" src="https://www.youtube-nocookie.com/embed/CZDgLG6jpgw" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
            </div>
            <div className='w-full my-10'>
                <div className='text-2xl text-center font-bold py-6'>
                    Supported Currencies
                </div>
                <div className='flex justify-center flex-wrap'>
                    {/* 対応済み */}
                    <div className='w-128 h-96 border-2 rounded-lg m-4'>
                        <div className='text-center text-lg text-blue-500 font-bold py-4'>対応済み</div>
                        <div className='w-full'>
                            <div className='text-center text-xl py-20'>
                                <div>WETH</div>
                                <div>JPYC</div>
                                <div>MATIC</div>
                                <div>USDC</div>
                            </div>
                        </div>
                    </div>
                    {/* 未対応 */}
                    <div className='w-128 h-96 border-2 rounded-lg m-4'>
                        <div className='text-center text-lg text-red-500 font-bold py-4'>対応済み</div>
                        <div className='w-full'>
                            <div className='text-center text-xl py-20'>
                                <div>USDT</div>
                                <div>BNB</div>
                                <div>ChainLink</div>
                                <div>BAT</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}