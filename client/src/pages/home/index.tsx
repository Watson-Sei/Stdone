import LgImage from '../../assets/images/image1.jpeg';
import BankNone from '../../assets/images/bank-none.svg';
import AnyTime from '../../assets/images/anytime.svg';
import AlertBox from '../../assets/images/alertbox.svg';
import Community from '../../assets/images/community.svg';

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
                    Stdone User Benefits
                </div>
                <div className='w-full max-w-screen-lg my-0 mx-auto flex justify-center flex-wrap'>
                    <div className='flex justify-around flex-wrap'>
                        <div className='w-56 h-72 my-2 mx-4'>
                            <img src={BankNone} alt='' className='w-20 h-20 mx-auto' />
                            <div className='text-center font-bold py-2'>
                                銀行口座、年齢制限なし
                            </div>
                            <div className=''>
                                従来の中央主権による、年齢制限や口座凍結などの脅しからユーザーを解放します。
                            </div>
                        </div>
                        <div className='w-56 h-72 my-2 mx-4'>
                            <img src={AnyTime} alt='' className='w-20 h-20 mx-auto' />
                            <div className='text-center font-bold py-2'>
                                いつからでも収益化
                            </div>
                            <div className=''>
                                収益化は、あなたの気分次第でいつからでも始めることができます。
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-around flex-wrap'>
                        <div className='w-56 h-72 my-2 mx-4'>
                            <img src={AlertBox} alt='' className='w-20 h-20 mx-auto' />
                            <div className='text-center font-bold py-2'>
                                従来の機能もサポート
                            </div>
                            <div className=''>
                                アラームボックスなどストリーマー向け機能を随時サポート
                            </div>
                        </div>
                        <div className='w-56 h-72 my-2 mx-4'>
                            <img src={Community} alt='' className='w-20 h-2- mx-auto' />
                            <div className='text-center font-bold py-2'>
                                オープンコミュニティ
                            </div>
                            <div className=''>
                                Stdoneコミュニティはオープンです、全てのコミュニティメンバーの意見が次のサービスの目標を決める決定権を保持します。
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full my-10'>
                <div className='text-2xl text-center font-bold py-6'>
                    How to Use
                </div>
                <div className='text-center w-full'>
                    <iframe className='my-0 mx-auto w-full max-w-screen-lg h-96 sm:px-12 lg:px-32' width="560" height="315" src="https://www.youtube-nocookie.com/embed/CZDgLG6jpgw" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
            </div>
            <div className='w-full my-10'>
                <div className='text-2xl text-center font-bold py-6'>
                    Supported Currencies
                </div>
                <div className='flex justify-center flex-wrap'>
                    {/* 対応済み */}
                    <div className='w-128 h-60 border-2 rounded-lg m-4'>
                        <div className='text-center text-lg text-blue-500 font-bold py-4'>対応済み</div>
                        <div className='w-full'>
                            <div className='flex justify-center flex-wrap text-xl py-10'>
                                <div className='flex justify-center my-2'>
                                    <img src="https://assets.coingecko.com/coins/images/2518/small/weth.png?1628852295" className='w-7 h-7' alt="" />
                                    <div className='w-24 text-left ml-4'>WETH</div>
                                </div>
                                <div className='flex justify-center my-2'>
                                    <img src="https://assets.coingecko.com/coins/images/17277/small/WoZ8rruL_400x400.png?1627016492" className='w-7 h-7' alt="" />
                                    <div className='w-24 text-left ml-4'>JPYC</div>
                                </div>
                                <div className='flex justify-center my-2'>
                                    <img src="https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912" className='w-7 h-7' alt="" />
                                    <div className='w-24 text-left ml-4'>MATIC</div>
                                </div>
                                <div className='flex justify-center my-2'>
                                    <img src="https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389" className='w-7 h-7' alt="" />
                                    <div className='w-24 text-left ml-4'>USDC</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* 未対応 */}
                    <div className='w-128 h-60 border-2 rounded-lg m-4'>
                        <div className='text-center text-lg text-red-500 font-bold py-4'>未対応</div>
                        <div className='w-full'>
                            <div className='flex justify-center flex-wrap text-xl py-10'>
                                <div className='flex justify-center my-2'>
                                    <img src="https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615" className='w-7 h-7' alt="" />
                                    <div className='w-24 text-left ml-4'>BNB</div>
                                </div>
                                <div className='flex justify-center my-2'>
                                    <img src="https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png?1548822744" className='w-7 h-7' alt="" />
                                    <div className='w-24 text-left ml-4'>WBTC</div>
                                </div>
                                <div className='flex justify-center my-2'>
                                    <img src="https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png?1547034700" className='w-7 h-7' alt="" />
                                    <div className='w-24 text-left ml-4'>ChainLink</div>
                                </div>
                                <div className='flex justify-center my-2'>
                                    <img src="https://assets.coingecko.com/coins/images/677/small/basic-attention-token.png?1547034427" className='w-7 h-7' alt="" />
                                    <div className='w-24 text-left ml-4'>BAT</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}