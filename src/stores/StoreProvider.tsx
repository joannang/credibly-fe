import * as React from 'react';
import AppStore from './AppStore';
import UiState from './UiState';
import WalletStore from './WalletStore';

export interface StoreContext {
    appStore: AppStore;
    uiState: UiState;
    walletStore: WalletStore;
}

let stores: StoreContext | null = null;
const storeContext = React.createContext<StoreContext | null>(stores);

export const createStores = () => {
    const uiState = new UiState();
    stores = {
        uiState,
        appStore: new AppStore(uiState),
        walletStore: new WalletStore(),
    };

    return stores;
};

export const useStores = (): StoreContext => {
    const stores = React.useContext<StoreContext | null>(storeContext);
    if (!stores) {
        // this is especially useful in TypeScript so you don't need to be checking for null all the time
        throw new Error('useStores must be used within a StoreProvider.');
    }
    return stores;
};

const StoreProvider = ({ children }) => {
    stores === null && createStores();

    return (
        <storeContext.Provider value={stores}>{children}</storeContext.Provider>
    );
};

export default StoreProvider;
