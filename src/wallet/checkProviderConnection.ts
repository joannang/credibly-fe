import { ethers } from 'ethers';
import WalletStore from '../stores/WalletStore';

export const checkProviderConnection = async (
    provider: any,
    walletStore: WalletStore
) => {
    const isConnected = provider.isConnected();
    if (isConnected) {
        const tempProvider = new ethers.providers.Web3Provider(provider);
        const networkInfo = await tempProvider.getNetwork();
        console.log(
            `Current Connected Network: ${JSON.stringify(networkInfo)}`
        );

        const chainParameters = walletStore.getEthereumChainParameters();
        const targetChainId = parseInt(chainParameters.chainId);
        if (networkInfo.chainId !== targetChainId) {
            console.log(
                `${networkInfo.chainId} detected instead of ${targetChainId}, aborting...`
            );
            throw new Error('Failed to connect to correct ethereum chain');
        }
    } else {
        throw new Error('Failed to connect');
    }
};
