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