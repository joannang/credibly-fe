import { observable, makeObservable, action, runInAction } from 'mobx';
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

export enum AccountType {
    ADMIN = 0,
    ORGANISATION = 1,
    AWARDEE = 2
}

export type UserType = {
    id: number;
    name: string;
    email: string;
    password: string;
    walletAddress: string;
    accountType: AccountType;
    token: string;
};

export type RegisterAccountType = {
    name: string;
    email: string;
    uen?: string;
    password: string;
    walletAddress: string;
    accountType: AccountType;
}

export type RegisterUploadType = {
    userId: number;
    documents: File[];
}

export interface DocumentDto {
    id: number;
    name: string;
}

export type ApprovalType = {
    key: number;
    name: string;
    email: string;
    uen: string;
    documents: DocumentDto[];
}

export type Awardee = {
    name: string;
    email: string;
}

export type CertificateDetails = {
    awardeeName: string;
    orgName: string;
    dateOfIssue: string;
    certificateName: string;
    description: string;
    imageUrl: string;
    certificateId: string;
}
class AppStore {
    appService = new AppService();
    isAuthenticated: string = sessionStorage.getItem('authenticated');
    currentUser: Partial<UserType> = JSON.parse(sessionStorage.getItem('user'));
    pendingApprovalList: ApprovalType[] = []

    constructor(uiState: UiState) {
        makeObservable(this, {
            isAuthenticated: observable,
            currentUser: observable,
            pendingApprovalList: observable,
            setIsAuthenticated: action,
            setCurrentUser: action,
            setPendingApprovalsList: action
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
        this.currentUser = { ...data };
        this.isAuthenticated = 'true';
        sessionStorage.setItem('authenticated', 'true');
        sessionStorage.setItem(
            'user',
            JSON.stringify(this.currentUser)
        );
        return data;
    };

    getRegistrationDocument = async (id: number) => {
        const { data } = await this.appService.getRegistrationDocument(id, this.currentUser.token);
        return data;
    };

    approveAccounts = async (approverId: number, userIds: number[]) => {
        await this.appService.approveAccounts(approverId, userIds, this.currentUser.token);
    }

    // @action
    setIsAuthenticated = (auth: string) => {
        this.isAuthenticated = auth;
    };

    setCurrentUser = (user: Partial<UserType>) => {
        const { name, email, walletAddress, accountType, token } = user;
        this.currentUser = { name, email, walletAddress, accountType, token };
    }

    setPendingApprovalsList = async () => {
        try {
            const { data } = await this.appService.getPendingApprovals(this.currentUser.token);
            runInAction(() => (this.pendingApprovalList = [...data]));
        } catch (err) {
            this.uiState.setError(err.error)
        }
    };
    retrieveAwardee = async (email: string) => {
        try {
            const { data } = await this.appService.retrieveAwardee(email);

            return data as Awardee;
        } catch (err) {
            if (err) {
                this.uiState.setError(err.error)
            }
        }
    }

    // ------------------------- BLOCKCHAIN CALLS -------------------------------------------------

    retrieveCertificateInfo = async (certificateId: string) => {
        try {
            const data = await this.appService.retrieveCertificateInfo(certificateId);
            return data as CertificateDetails;
        } catch (err) {
            this.uiState.setError(err.error)
        }
    };
    retrieveProfileDetails = async (email: string) => {
        try {
            const data = await this.appService.retrieveProfileDetails(email);
            return data as CertificateDetails[];
        } catch (err) {
            this.uiState.setError(err.error)
        }
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
