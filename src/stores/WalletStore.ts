import { observable, action, makeObservable, autorun } from 'mobx';
import { initialiseWalletConnection } from '../wallet/initialiseWalletConnection';

interface WalletStore {
    walletAddress: string; // 'linked', 'created'
}

class WalletStore {
    walletAddress = '';

    constructor() {
        makeObservable(this, {
            walletAddress: observable,
            setWalletAddress: action,

            getEthereumChainParameters: action,
        });

        autorun(() => initialiseWalletConnection(this));
    }

    // @action
    setWalletAddress = (address: string) => {
        this.walletAddress = address;
    };

    // TODO: To change the parameters depending on network being used
    getEthereumChainParameters = () => {
        return {
            chainId: '0x4', // A 0x-prefixed hexadecimal string
            chainName: 'Rinkeby',
            nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ETH', // 2-6 characters long
                decimals: 18,
            },
            rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
        };
    };
}

export default WalletStore;
