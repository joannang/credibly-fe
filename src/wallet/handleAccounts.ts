import WalletStore from '../stores/WalletStore';

export const handleAccountsChanged = (
    accounts: string[],
    walletStore: WalletStore
) => {
    if (accounts.length == 0) {
        // MetaMask is locked or the user has not connected any accounts
        console.log('Please connect to MetaMask.');
        throw new Error('No accounts Detected');
    } else {
        let currentAccount = accounts[0];
        walletStore.setWalletAddress(currentAccount);

        console.log(`Account set: ${currentAccount}`);
    }
};
