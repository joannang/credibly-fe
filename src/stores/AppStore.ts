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
};

export type RegisterUploadType = {
    userId: number;
    documents: File[];
};

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
};
export type CertificateTemplateType = {
    certificateId: string;
    certificateName: string;
    image: string;
};

export type AwardeeGroupType = {
    id: number;
    organisationId: number;
    groupName: string;
    groupDescription: string;
    certificateTemplateId: number;
};

export type Awardee = {
    name: string;
    email: string;
};

export type CertificateDetails = {
    awardeeName: string;
    orgName: string;
    dateOfIssue: string;
    certificateName: string;
    description: string;
    imageUrl: string;
    certificateId: string;
};

export type TransferRequestType = {
    userId: number;
    organisationId: number;
    transferTo: string;
};

export type TransferRequestUploadType = {
    transferRequestId: number;
    documents: File[];
};

class AppStore {
    appService = new AppService();
    isAuthenticated: string = sessionStorage.getItem('authenticated');
    currentUser: Partial<UserType> = JSON.parse(sessionStorage.getItem('user'));
    pendingApprovalList: ApprovalType[] = [];
    certificateTemplates: CertificateTemplateType[] = [];
    awardeeGroups: AwardeeGroupType[] = [];

    constructor(uiState: UiState) {
        makeObservable(this, {
            isAuthenticated: observable,
            currentUser: observable,
            pendingApprovalList: observable,
            awardeeGroups: observable,
            setIsAuthenticated: action,
            setCurrentUser: action,
            setPendingApprovalsList: action,
            certificateTemplates: observable,
            setCertificateTemplates: action,
            setAwardeeGroups: action,
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

    generateCertificates = async (
        certName: string,
        orgId: number,
        awardeeNames: string[]
    ) => {
        try {
            const response = await this.appService.generateCertificatesAsync(
                certName,
                orgId,
                awardeeNames,
                this.currentUser.token
            );
            return response.data;
        } catch (err) {
            this.uiState.setError(err.messsage);
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
    };

    registerUpload = async (registerUpload: RegisterUploadType) => {
        await this.appService.registerUploadAsync(registerUpload);
    };

    login = async (email: string, password: string) => {
        const { data } = await this.appService.loginAsync(email, password);
        this.currentUser = { ...data };
        this.isAuthenticated = 'true';
        sessionStorage.setItem('authenticated', 'true');
        sessionStorage.setItem('user', JSON.stringify(this.currentUser));
        return data;
    };

    getRegistrationDocument = async (id: number) => {
        const { data } = await this.appService.getRegistrationDocument(
            id,
            this.currentUser.token
        );
        return data;
    };

    approveAccounts = async (approverId: number, userIds: number[]) => {
        await this.appService.approveAccounts(
            approverId,
            userIds,
            this.currentUser.token
        );
    };

    createAwardeeGroup = async (
        organisationId: number,
        groupName: string,
        groupDescription: string,
        certificateTemplateId: number
    ) => {
        const { data } = await this.appService.createAwardeeGroupAsync(
            organisationId,
            groupName,
            groupDescription,
            certificateTemplateId,
            this.currentUser.token
        );
        return data;
    };

    removeAwardeeGroup = async (organisationId: number, groupIds: number[]) => {
        try {
            await this.appService.removeAwardeeGroupAsync(
                organisationId,
                groupIds,
                this.currentUser.token
            );
        } catch (err) {
            console.log(err);
        }
    };

    uploadCertificateTemplate = async (
        certificateTemplateName: string,
        image: File,
        organisationId: number
    ) => {
        const { data } = await this.appService.uploadCertificateTemplateAsync(
            certificateTemplateName,
            image,
            organisationId,
            this.currentUser.token
        );
        return data;
    };

    // @action
    setCertificateTemplates = async (organisationId: number) => {
        try {
            const { data } = await this.appService.getCertificateTemplatesAsync(
                organisationId,
                this.currentUser.token
            );

            runInAction(() => (this.certificateTemplates = [...data]));
        } catch (err) {
            console.log(err);
        }
    };

    getCertificateTemplates() {
        return this.certificateTemplates;
    }

    getCertificateTemplatesById = async (ids: number[]) => {
        const { data } = await this.appService.getCertificateTemplatesByIdAsync(
            ids,
            this.currentUser.token
        );
        return data;
    };

    deleteCertificateTemplate = async (
        certificateName: string,
        organisationId: number
    ) => {
        try {
            await this.appService.deleteCertificateTemplateAsync(
                certificateName,
                organisationId
            );
        } catch (err) {
            console.log(err);
        }
    };

    // @action
    setIsAuthenticated = (auth: string) => {
        this.isAuthenticated = auth;
    };

    setCurrentUser = (user: Partial<UserType>) => {
        const { name, email, walletAddress, accountType, token } = user;
        this.currentUser = { name, email, walletAddress, accountType, token };
    };

    setPendingApprovalsList = async () => {
        try {
            const { data } = await this.appService.getPendingApprovals(
                this.currentUser.token
            );
            runInAction(() => (this.pendingApprovalList = [...data]));
        } catch (err) {
            // this.uiState.setError(err.error);
        }
    };
    retrieveAwardee = async (email: string) => {
        try {
            const { data } = await this.appService.retrieveAwardee(email);

            return data as Awardee;
        } catch (err) {
            if (err) {
                this.uiState.setError(err.error);
            }
        }
    };

    createTransferRequest = async (
        userId: number,
        organisationId: number,
        transferTo: string
    ) => {
        const { data } = await this.appService.createTransferRequestAsync(
            userId,
            organisationId,
            transferTo,
            this.currentUser.token
        );
        return data;
    };

    transferRequestUpload = async (
        transferRequestUpload: TransferRequestUploadType
    ) => {
        await this.appService.transferRequestUploadAsync(transferRequestUpload);
    };

    // ------------------------- BLOCKCHAIN CALLS -------------------------------------------------

    retrieveCertificateInfo = async (certificateId: string) => {
        try {
            const data = await this.appService.retrieveCertificateInfo(
                certificateId
            );
            return data as CertificateDetails;
        } catch (err) {
            this.uiState.setError(err.error);
        }
    };
    retrieveProfileDetails = async (email: string) => {
        try {
            const data = await this.appService.retrieveProfileDetails(email);
            return data as CertificateDetails[];
        } catch (err) {
            this.uiState.setError(err.error);
        }
    };

    setAwardeeGroups = async (organisationId: number) => {
        try {
            const { data } = await this.appService.getAwardeeGroupsAsync(
                organisationId,
                this.currentUser.token
            );

            runInAction(() => (this.awardeeGroups = [...data]));
        } catch (err) {
            console.log(err);
        }
    };

    createCertificateNFT = async (ipfsHash: string) => {
        try {
            console.log(this.currentUser.walletAddress);
            const tokenId = await this.appService.createCertificateNFT(
                // this.currentUser.walletAddress,  // TODO: i think currently the wallet address field is not wallet address?
                '0x06954880866b10a73689197A72165aC585ec6E9E',
                ipfsHash
            );
            console.log(typeof tokenId);
            return tokenId;
        } catch (err) {
            console.log(err.message);
        }
    };

    retrieveCertificateNFT = async (tokenId: number) => {
        try {
            const response = await this.appService.retrieveCertificateNFT(
                tokenId
            );
            console.log(response);
        } catch (err) {
            console.log(err.message);
        }
    };
}

export default AppStore;
