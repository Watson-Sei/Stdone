export default function Profile() {

    return (
        <>
            <div className="w-full px-8">
                {/* ユーザー情報 */}
                <div className="w-full max-w-screen-sm mx-auto mt-10">
                    <div className="text-xl font-bold">
                        基本情報
                    </div>
                    <div className="w-full bg-gray-300 p-8 rounded-md">
                        <span className="text-xl font-bold text-gray-800">UserName: </span>NullName<br/>
                        <span className="text-xl font-bold text-gray-800">E-mail: </span>abc@gmail.com
                    </div>
                </div>
                {/* ウォレット */}
                <div className="w-full max-w-screen-sm mx-auto mt-10">
                    <div className="text-xl font-bold">
                        Wallet
                    </div>
                    <div className="w-full bg-gray-300 p-8 rounded-md">
                        <span>0xB863..</span>
                    </div>
                </div>
                {/* 収益・口座 */}
                <div className="w-full max-w-screen-sm mx-auto mt-10">
                    <div className="text-xl font-bold">
                        収益
                    </div>
                    <div className="w-full bg-gray-300 p-8 rounded-md">
                        
                    </div>
                </div>
            </div>
        </>
    )
}