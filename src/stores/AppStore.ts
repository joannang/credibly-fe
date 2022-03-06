import { observable, makeObservable, action } from 'mobx';
import AppService from './AppService';
import UiState from './UiState';
import { ContractTransaction } from 'ethers';

/**
 * Only mutable data should be made observable.
 */

interface AppStore {
    appService: AppService;
    uiState: UiState;
}

export type UserType = {
    _id?: number;
    userName: string;
    userPassword: string;
    userWalletAddress: string;
};

class AppStore {
    appService = new AppService();
    isAuthenticated: string = sessionStorage.getItem('authenticated');
    currentUser: UserType = {
        userName: '',
        userPassword: '',
        userWalletAddress: '',
    };

    constructor(uiState: UiState) {
        makeObservable(this, {
            isAuthenticated: observable,
            setIsAuthenticated: action,
        });
        this.uiState = uiState;
    }

    signUp = async (user: UserType) => {
        try {
            const response = await this.appService.signUpAsync(user); // isOk & message
            if (response.isOk) {
                sessionStorage.setItem('authenticated', 'true');
                this.uiState.setSuccess(
                    'Sign up successful! Please log in to use Nomnom :)'
                );
            } else {
                this.uiState.setError(response.message);
            }
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    // @action
    setIsAuthenticated = (auth: string) => {
        this.isAuthenticated = auth;
    };

    // Example of calling appService buyFoodAsync method
    buyFood = async (food: any, price: number) => {
        try {
            this.uiState.setIsLoading(true);
            // Interacts with the borrow media method in the contract
            const tx: ContractTransaction = await this.appService.buyFoodAsync(
                food._id,
                price
            );
            await tx.wait();
            this.uiState.setIsLoading(false);
            this.uiState.setSuccess('Successfully bought ' + food.foodName);
        } catch (err) {
            const errorMsg = this.appService.signer
                ? `Failed to buy food, please try again!`
                : 'Please connect to your MetaMask account to buy food!';
            console.log(err);
            this.uiState.setIsLoading(false);
            this.uiState.setError(errorMsg);
        }
    };
}

export default AppStore;
