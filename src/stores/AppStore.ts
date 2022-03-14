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
    name: string;
    email: string;
    password: string;
    walletAddress: string;
    accountType: number;
    token: string;
};

export type RegisterAccountType = {
    name: string;
    email: string;
    uen?: string;
    password: string;
    walletAddress: string;
    accountType: number;
}

export type RegisterUploadType = {
    userId: number;
    documents: File[];
}

class AppStore {
    appService = new AppService();
    isAuthenticated: string = sessionStorage.getItem('authenticated');
    currentUser: Partial<UserType> = {
        email: '',
        walletAddress: '',
        accountType: undefined,
        token: ''
    };

    constructor(uiState: UiState) {
        makeObservable(this, {
            isAuthenticated: observable,
            setIsAuthenticated: action,
            setCurrentUser: action
        });
        this.uiState = uiState;
    }

    // signUp = async (user: UserType) => {
    //     try {
    //         const response = await this.appService.signUpAsync(user); // isOk & message
    //         if (response.isOk) {
    //             sessionStorage.setItem('authenticated', 'true');
    //             this.uiState.setSuccess(
    //                 'Sign up successful! Please log in to use Nomnom :)'
    //             );
    //         } else {
    //             this.uiState.setError(response.message);
    //         }
    //     } catch (err) {
    //         this.uiState.setError(err.message);
    //     }
    // };

    register = async (accountDetails: RegisterAccountType) => {
        const { data } = await this.appService.registerAsync(accountDetails);
        return data;
    }

    registerUpload = async (registerUpload: RegisterUploadType) => {
        await this.appService.registerUploadAsync(registerUpload);
    }

    login = async (email: string, password: string) => {
        const { data } = await this.appService.loginAsync(email, password);
        sessionStorage.setItem('authenticated', 'true');
        return data;
    };

    // @action
    setIsAuthenticated = (auth: string) => {
        this.isAuthenticated = auth;
    };

    setCurrentUser = (user: Partial<UserType>) => {
        const { name, email, walletAddress, accountType, token } = user;
        this.currentUser = { name, email, walletAddress, accountType, token };
    }

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
