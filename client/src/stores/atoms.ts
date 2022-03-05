import {atom} from 'recoil';
import {recoilPersist} from 'recoil-persist';

const {persistAtom} = recoilPersist();

export const walletAddressState = atom({
    key: 'walletAddress', 
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const chainIdState = atom({
    key: 'chainId',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const walletProviderState = atom({
    key: 'walletProvider',
    default: '',
    effects_UNSTABLE: [persistAtom],
});

export const accountBalanceState = atom({
    key: 'accountBalance',
    default: 0,
    effects_UNSTABLE: [persistAtom],
});

export const accessTokenState = atom({
    key: 'accessToken',
    default: '',
    effects_UNSTABLE: [persistAtom],
});