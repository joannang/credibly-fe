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
    AWARDEE = 2,
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

export type AwardeeType = {
    id?: number;
    key?: number;
    name: string;
    email: string;
    date?: string;
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
export type CertificateTemplateType = {
    certificateName: string;
    image: string;
};

class AppStore {
    appService = new AppService();
    isAuthenticated: string = sessionStorage.getItem('authenticated');
    currentUser: Partial<UserType> = JSON.parse(sessionStorage.getItem('user'));
    pendingApprovalList: ApprovalType[] = []
    certificateTemplates: CertificateTemplateType[] = [];

    constructor(uiState: UiState) {
        makeObservable(this, {
            isAuthenticated: observable,
            currentUser: observable,
            pendingApprovalList: observable,
            setIsAuthenticated: action,
            setCurrentUser: action,
            setPendingApprovalsList: action,
            certificateTemplates: observable,
            setCertificateTemplates: action,
        });
        this.uiState = uiState;
    }

    createAwardees = async (
        organisationId: number,
        awardees: AwardeeType[]
    ) => {
        try {
            const response = await this.appService.createAwardeesAsync(
                organisationId,
                awardees,
                this.currentUser.token
            );
            console.log(response);
            return response.data;
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    addAwardeesToGroup = async (
        organisationId: number,
        groupId: number,
        awardeeIds: number[]
    ) => {
        try {
            const response = await this.appService.addAwardeesToGroupAsync(
                organisationId,
                groupId,
                awardeeIds,
                this.currentUser.token
            );
            return response.data;
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

    getAwardeesFromGroup = async (groupId: number) => {
        try {
            const response = await this.appService.getAwardeesFromGroupAsync(
                groupId,
                this.currentUser.token
            );
            return response.data;
        } catch (err) {
            this.uiState.setError(err.message);
        }
    };

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

    uploadCertificateTemplate = async (certificateTemplateName: string, image: File, organisationId: number) => {
        const { data } = await this.appService.uploadCertificateTemplateAsync(certificateTemplateName, image, organisationId);
        return data;
    }

    // @action
    setCertificateTemplates = async (organisationId: number) => {
        try {
            const { data } = await this.appService.getCertificateTemplatesAsync(organisationId);

            runInAction(() => (this.certificateTemplates = [...data]));
        } catch (err) {
            console.log(err);
        }
    };

    getCertificateTemplates() {
        return this.certificateTemplates;
    }

    deleteCertificateTemplate = async (certificateName: string, organisationId: number) => {
        try {
            await this.appService.deleteCertificateTemplateAsync(certificateName, organisationId);
        } catch (err) {
            console.log(err);
        }
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
