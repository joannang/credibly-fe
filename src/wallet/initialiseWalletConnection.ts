// import detectEthereumProvider from '@metamask/detect-provider';
import { checkProviderConnection } from './checkProviderConnection';
import { handleNetworkSwitch } from './handleNetworkSwitch';
import WalletStore from '../stores/WalletStore';
import { handleAccountsChanged } from './handleAccounts';
// import { logout } from '@tinnolab/azure-b2c-sso';

// Detect mobile or extension provider - Call this on app initiation to switch network
export const initialiseWalletConnection = async (walletStore: WalletStore) => {
    try {
        const { ethereum } = window;

        if (ethereum) {
            // From now on, this should always be true:
            // provider === window.ethereum
            // Prompt for chain switch
            console.log('Start Metamask connection');

            console.log('Checking for chain network');
            await handleNetworkSwitch(ethereum, walletStore);
            await ethereum.on('chainChanged', (chainId) =>
                window.location.reload()
            );

            await ethereum.on('accountsChanged', () => {
                handleAccountsChanged;
                window.location.reload();
            });

            // Check if chain switch is successful
            await checkProviderConnection(ethereum, walletStore);

            if (
                typeof window !== 'undefined' &&
                typeof window.ethereum !== 'undefined'
            ) {
                window.ethereum
                    .request({ method: 'eth_requestAccounts' })
                    .then((response) => {
                        walletStore.setWalletAddress(response[0]);
                    });
            } else {
                console.log('trying to catch the network error');
            }
        } else {
            console.log('Another provider was detected');
            // throw new Error('Another provider was detected');
        }
    } catch (err) {
        // if err.code === 4001 - Request got rejected by user
        // Abort whole process if any part throws error
        console.log(err.message);
    }
};
