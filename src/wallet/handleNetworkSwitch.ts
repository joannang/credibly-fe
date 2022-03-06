import WalletStore from '../stores/WalletStore';

// Tries to switch ethereum chain. If not detected, prompts user to add as new network
export const handleNetworkSwitch = async (
    metamaskProvider: any,
    walletStore: WalletStore
) => {
    const ethereumChainParameters = walletStore.getEthereumChainParameters();
    const chainId = ethereumChainParameters.chainId;

    try {
        // Try to switch chain
        await metamaskProvider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId }],
        });
        console.log('Chain detected');
        console.log(`Network swapped to chainId: ${chainId}`);
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        console.log(
            'Existing chain not detected - Prompting for user to add chain'
        );
        await metamaskProvider.request({
            method: 'wallet_addEthereumChain',
            params: [ethereumChainParameters],
        });
        console.log('Successfully added new chain');
        return;
    }
};
