import { Navigate, Outlet } from "react-router-dom";
import { useWallet } from "../hooks/useWallet";

export const Private = () => {
    const {walletAddress, chainId} = useWallet();

    return walletAddress && chainId ? (
        <Outlet />
    ) : (
        <Navigate to="/" replace />
    )
}