import { observable, makeObservable, action, runInAction } from 'mobx';
import AppService from './AppService';
import UiState from './UiState';
import { ContractTransaction } from 'ethers';
import { NextRouter } from 'next/router';

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
    uen?: string;
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
export interface UserDto {
    name: string;
    email: string;
    newEmail: string;
}

export type ApprovalType = {
    key: number;
    name: string;
    email: string;
    uen: string;
    walletAddress: string;
    documents: DocumentDto[];
};

export type CertificateTemplateType = {
    certificateId: string;
    certificateName: string;
    image: string;
};

export type AwardeeGroupType = {
    key: number;
    organisationId: number;
    groupName: string;
    groupDescription: string;
    certificateTemplateId: number;
    certificateName: string;
};

export type Awardee = {
    name: string;
    email: string;
};
export type WorkExperience = {
    end: boolean;
    startDate: string;
    endDate: string;
    description: string;
    position: string;
    organisation: string;
}
export type CertificateDetails = {
    awardeeName?: string;
    orgName?: string;
    dateOfIssue?: string;
    certificateName?: string;
    description?: string;
    image?: string;
    certificateId?: string;
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
    searchResults: Awardee[] = [];

    constructor(uiState: UiState) {
        makeObservable(this, {
            isAuthenticated: observable,
            currentUser: observable,
            pendingApprovalList: observable,
            awardeeGroups: observable,
            searchResults: observable,
            setIsAuthenticated: action,
            setCurrentUser: action,
            setPendingApprovalsList: action,
            certificateTemplates: observable,
            setCertificateTemplates: action,
            setAwardeeGroups: action,
            setSearchResults: action,
        });
        this.uiState = uiState;
    }

    onLogout = (router: NextRouter) => {
        router.push('/login');
        this.setCurrentUser({ name: '' });
        this.setIsAuthenticated('');
        sessionStorage.removeItem('authenticated');
        sessionStorage.removeItem('user');
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
        awardees: AwardeeType[]
    ) => {
        try {
            const response = await this.appService.generateCertificatesAsync(
                certName,
                orgId,
                awardees,
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

    login = async (email: string, password: string, walletAddress: string) => {
        const { data } = await this.appService.loginAsync(email, password, walletAddress);
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
                organisationId,
                this.currentUser.token
            );
        } catch (err) {
            console.log(err);
        }
    };

    // @action
    setSearchResults = async (query: string) => {
        try {
            const { data } = await this.appService.searchAwardeesAsync(
                query,
            );

            runInAction(() => (this.searchResults = [...data]));
        } catch (err) {
            console.log(err);
        }
    };

    getSearchResults() {
        return this.searchResults;
    }

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

    retrieveCertificateInfo = async (certificateAddr: string, tokenId: string) => {
        try {
            const data = await this.appService.retrieveCertificateInfo(
                certificateAddr, tokenId
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

    getAwardeeGroups = () => {
        return this.awardeeGroups;
    };

    getAwardeesFromOrganisation = async (orgId: number) => {
        try {
            const res = await this.appService.getAwardeesFromOrganisationAsync(
                orgId,
                this.currentUser.token
            );
            return res.data;
        } catch (err) {
            console.log(err);
        }
    };

    addAwardeeToOrganisation = async (
        uen: string,
        email: string,
        name: string
    ) => {
        try {
            const res = await this.appService.addAwardeeToOrganisation(
                uen,
                email,
                name
            );
            return res;
        } catch (err) {
            console.log(err);
        }
    };

    getEmployeesFromOrganisationContract = async (uen: string) => {
        try {
            const res = await this.appService.getEmployeesFromOrganisation(uen);
            return res;
        } catch (err) {
            console.log(err);
        }
    };

    bulkAddAwardeesToOrganisation = async (
        uen: string,
        emails: string[],
        names: string[]
    ) => {
        try {
            const res = await this.appService.bulkAddAwardeesToOrganisation(
                uen,
                emails,
                names
            );
            return res;
        } catch (err) {
            console.log(err);
        }
    };

    createCertificateContract = async (
        groupName: string,
        groupId: number,
        description: string,
        uen: string
    ) => {
        try {
            const res = await this.appService.createCertificateContract(
                groupName,
                groupId,
                description,
                uen
            );
            return res;
        } catch (err) {
            console.log(err);
        }
    };

    mintCertificateNFT = async (
        email: string,
        groupId: number,
        ipfsHash: string,
        uen: string
    ) => {
        try {
            const res = await this.appService.mintCertificateNFT(
                email,
                groupId,
                ipfsHash,
                uen
            );
            console.log(res);
            return res;
        } catch (err) {
            console.log(err.message);
        }
    };

    bulkAwardCertificates = async (
        uen: string,
        groupId: number,
        ipfsHashes: string[],
        emails: string[]
    ) => {
        try {
            const res = await this.appService.bulkAwardCertificates(
                uen,
                emails,
                groupId,
                ipfsHashes
            );
            console.log(res);
            return res;
        } catch (err) {
            console.log(err.message);
        }
    };

    addWorkExperience = async (
        email: string,
        position: string,
        description: string,
        startDate: string,
        uen: string
    ) => {
        try {
            const res = await this.appService.addWorkExperience(
                email,
                position,
                description,
                startDate,
                uen
            );
            console.log(res);
            return res;
        } catch (err) {
            console.log(err.message);
        }
    };

    endWorkExperience = async (
        email: string,
        position: string,
        endDate: string,
        uen: string
    ) => {
        try {
            const res = await this.appService.endWorkExperience(
                email,
                position,
                endDate,
                uen
            );
            console.log(res);
            return res;
        } catch (err) {
            console.log(err.message);
        }
    };

    changeEmail = async (oldEmail: string, newEmail: string) => {
        try {
            const res = await this.appService.changeEmail(oldEmail, newEmail,
                this.currentUser.token,
                {
                    userId: this.currentUser.id,
                    email: newEmail
                }
            );
            console.log(res)
            return res;
        } catch (err) {
            console.log(err);
        }
    }

    getOrganisation = async (uen: string) => {
        try {
            const res = await this.appService.getOrganisation(uen);
            console.log(res);
            return res;
        } catch (err) {
            console.log(err.message);
        }
    };

    registerOrganisation = async (
        name: string,
        uen: string,
        admin: string
    ) => {
        try {
            const res = await this.appService.registerOrganisation(
                name,
                uen,
                admin
            );
            console.log(res);
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    };

    registerAwardee = async (
        email: string,
        name: string
    ) => {
        try {
            const res = await this.appService.registerAwardee(
                email,
                name
            );
            console.log(res);
        } catch (err) {
            console.log(err.message);
            throw err;
        }
    };

    getWorkExperiences = async (email: string) => {
        try {
            const res = await this.appService.getWorkExperiences(email);
            console.log(res);
            return res;
        } catch (err) {
            console.log(err.message);
        }
    };

    getProfileVisibility = async () => {
        try {
            const res = await this.appService.getProfileVisibility(this.currentUser.email);
            console.log(res);
            return res;
        } catch (err) {
            console.log(err.message);
        }
    }

    setProfileVisibility = async (isProfileVisible: boolean) => {
        try {
            const res = await this.appService.setProfileVisibility(this.currentUser.email, isProfileVisible);
            console.log(res);
            return res;
        } catch (err) {
            console.log(err.message);
        }
    }

    getAuthorisedUsers = async () => {
        try {
            const res = await this.appService.getAuthorisedUsers(this.currentUser.email);
            console.log(res);
            return res;
        } catch (err) {
            console.log(err.message);
        }
    }

    addAuthorisedUser = async (authorisedUserWalletAddress: string) => {
        try {
            const res = await this.appService.addAuthorisedUser(this.currentUser.email, authorisedUserWalletAddress);
            console.log(res);
            return res;
        } catch (err) {
            console.log(err.message);
        }
    }

    removeAuthorisedUser = async (authorisedUserWalletAddress: string) => {
        try {
            const res = await this.appService.removeAuthorisedUser(this.currentUser.email, authorisedUserWalletAddress);
            console.log(res);
            return res;
        } catch (err) {
            console.log(err.message);
        }
    }
}

export default AppStore;
