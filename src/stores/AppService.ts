import { ethers, Contract, ContractTransaction } from 'ethers';
import {
    JsonRpcProvider,
    Web3Provider,
    JsonRpcSigner,
} from '@ethersproject/providers';
import { ENDPOINT, SYSTEM_ADDRESS } from '../settings';
import restGet from '../lib/restGet';
import restPost from '../lib/restPost';
import {
    RegisterAccountType,
    RegisterUploadType,
    AwardeeType,
    TransferRequestUploadType,
} from './AppStore';
import { CERTIFICATE_ADDRESS } from '../settings';
import Certificate from '../../ethereum/build/contracts/Certificate.json';
import Organisation from '../../ethereum/build/contracts/Organisation.json';
import System from '../../ethereum/build/contracts/System.json';

declare global {
    interface Window {
        ethereum: any;
        ipfs?: any;
    }
}

interface AppService {
    provider: JsonRpcProvider | Web3Provider; // ethers provider
    signer: JsonRpcSigner;
    certificateContract: Contract; // factory contract instance
    supplierContract: Contract;
    systemContract: Contract;
}

/**
 * AppService - abstractor class to interact with Ethereum chain via Infura API.
 * Can be deployed to server backend without requiring users to install FE wallets like Metamask
 *
 * Reference for connecting to endpoint with ethers:
 * https://blog.infura.io/ethereum-javascript-libraries-web3-js-vs-ethers-js-part-ii/#section-6-ethers
 *
 */
class AppService {
    constructor() {
        if (
            typeof window !== 'undefined' &&
            typeof window.ethereum !== 'undefined'
        ) {
            // We are in the browser and metamask is running.
            window.ethereum.request({ method: 'eth_requestAccounts' });
            this.provider = new ethers.providers.Web3Provider(window.ethereum);
            this.signer = this.provider.getSigner(0);
        } else {
            // We are on the server *OR* the user is not running metamask
        }

        // contracts
        this.certificateContract = new ethers.Contract(
            CERTIFICATE_ADDRESS,
            Certificate.abi,
            this.provider
        );

        this.systemContract = new ethers.Contract(
            SYSTEM_ADDRESS,
            System.abi,
            this.provider
        );
    }

    createAwardeesAsync(
        organisationId: number,
        awardees: AwardeeType[],
        accessToken: string
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {
                    organisationId: organisationId,
                    awardees: awardees,
                };
                console.log(data);
                const response = await restPost({
                    endpoint: ENDPOINT + '/awardee/create',
                    data: data,
                    credentials: { accessToken },
                });
                console.log(response.data);
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    addAwardeesToGroupAsync(
        organisationId: number,
        groupId: number,
        awardeeIds: number[],
        accessToken: string
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {
                    organisationId: organisationId,
                    groupId: groupId,
                    awardeeIds: awardeeIds,
                };

                const response = await restPost({
                    endpoint: ENDPOINT + '/awardeeGroup/add',
                    data: data,
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    generateCertificatesAsync(
        certName: string,
        orgId: number,
        awardees: AwardeeType[],
        accessToken: string
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {
                    certificateName: certName,
                    organisationId: orgId,
                    awardees: awardees,
                };
                const response = await restPost({
                    endpoint: `${ENDPOINT}/certificateTemplate/generateCertificates`,
                    data: data,
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    uploadCertificateTemplateAsync(
        certificateTemplateName: string,
        image: File,
        organisationId: number,
        accessToken: string
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/certificateTemplate/create`,
                    data: {
                        certificateName: certificateTemplateName,
                        image: image,
                        organisationId: organisationId,
                    },
                    formData: true,
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response);
            }
        });
    }

    getCertificateTemplatesAsync(
        organisationId: number,
        accessToken: string
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: `${ENDPOINT}/certificateTemplate/organisation/${organisationId}`,
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    getCertificateTemplatesByIdAsync(ids: number[], accessToken: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/certificateTemplate/templates`,
                    data: { ids },
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    deleteCertificateTemplateAsync(
        certificateName: string,
        organisationId: number
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/certificateTemplate/delete`,
                    data: {
                        certificateName: certificateName,
                        organisationId: organisationId,
                    },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    getAwardeesFromGroupAsync(groupId: number, accessToken: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: ENDPOINT + `/awardeeGroup/${groupId}`,
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.message);
            }
        });
    }

    /**
     * REST Example below
     */
    // signUpAsync(user: UserType): any {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const data = {
    //                 userName: user.userName,
    //                 userPassword: user.userPassword,
    //                 userWalletAddress: user.userWalletAddress,
    //             };

    //             const response = await restPost({
    //                 endpoint: ENDPOINT + '/signup',
    //                 data: data,
    //             });
    //             resolve(response.data);
    //         } catch (err) {
    //             reject(err.message);
    //         }
    //     });
    // }

    registerAsync(accountDetails: RegisterAccountType): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/auth/register`,
                    data: accountDetails,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    registerUploadAsync(registerUpload: RegisterUploadType): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/document/registration/upload/${registerUpload.userId}`,
                    data: {
                        document: registerUpload.documents,
                    },
                    formData: true,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    loginAsync(email: string, password: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const data = { email, password };
                const response = await restPost({
                    endpoint: `${ENDPOINT}/auth/login`,
                    data,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    getPendingApprovals(accessToken: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: `${ENDPOINT}/user/pendingApprovals`,
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    getRegistrationDocument(id: number, accessToken: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: `${ENDPOINT}/document`,
                    _id: `${id}`,
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    approveAccounts(
        approverId: number,
        userIds: number[],
        accessToken: string
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/user/approve`,
                    data: { approverId, userIds },
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    getAwardeeGroupAsync(
        organisationId: number,
        groupName: string,
        awardeeIds?: number[]
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/certificateTemplate/create`,
                    data: {
                        groupName: groupName,
                        awardeeIds: awardeeIds,
                        organisationId: organisationId,
                    },
                    formData: true,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    createAwardeeGroupAsync(
        organisationId: number,
        groupName: string,
        groupDescription: string,
        certificateTemplateId: number,
        accessToken: string
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/awardeeGroup/create`,
                    data: {
                        organisationId: organisationId,
                        groupName: groupName,
                        groupDescription: groupDescription,
                        certificateTemplateId: certificateTemplateId,
                    },
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    getAwardeeGroupsAsync(organisationId: number, accessToken: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: `${ENDPOINT}/awardeeGroup/organisation/${organisationId}`,
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    removeAwardeeGroupAsync(
        organisationId: number,
        groupIds: number[],
        accessToken: string
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/awardeeGroup/removeGroups`,
                    data: {
                        groupIds: groupIds,
                        organisationId: organisationId,
                    },
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }
    retrieveAwardee(email: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: `${ENDPOINT}/awardee`,
                    _id: email,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    createTransferRequestAsync(
        userId: number,
        organisationId: number,
        transferTo: string,
        accessToken: string
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/transferRequest/create`,
                    data: {
                        userId: userId,
                        organisationId: organisationId,
                        transferTo: transferTo,
                    },
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    transferRequestUploadAsync(
        transferRequestUpload: TransferRequestUploadType
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(transferRequestUpload.documents);
                const response = await restPost({
                    endpoint: `${ENDPOINT}/document/transferRequest/upload/${transferRequestUpload.transferRequestId}`,
                    data: {
                        document: transferRequestUpload.documents,
                    },
                    formData: true,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    /**
     * EXAMPLES TO CALL SMART CONTRACT METHODS
     */
    // async getLastTokenId() {
    //     return this.factory.connect(this.signer).lastTokenID();
    // }

    // SMART CONTRACT CALLS
    async addAwardeeToOrganisation(
        uen: string,
        email: string,
        awardee: string
    ) {
        return this.systemContract
            .connect(this.signer)
            .addAwardeeToOrganisation(uen, email, awardee, {
                gasLimit: 2500000,
            });
    }

    async createCertificateContract(
        groupName: string,
        groupId: number,
        description: string,
        uen: string
    ) {
        const organisation_addr = await this.getOrganisation(uen);
        const organisationContract = new ethers.Contract(
            organisation_addr,
            Organisation.abi,
            this.provider
        );
        return organisationContract
            .connect(this.signer)
            .addCertificate(groupName, groupId, description);
    }

    async addWorkExperience(
        email: string,
        position: string,
        description: string,
        startDate: string,
        uen: string
    ) {
        const organisation_addr = await this.getOrganisation(uen);
        const organisationContract = new ethers.Contract(
            organisation_addr,
            Organisation.abi,
            this.provider
        );
        return organisationContract
            .connect(this.signer)
            .addWorkExperience(email, position, description, startDate);
    }

    // -------- REMOVE LATER REPLACE WITH JUNLE FUNCTIONS, JUST TESTING
    async registerOrganisation(
        name: string,
        uen: string,
        adminWalletAddress: string
    ) {
        return this.systemContract
            .connect(this.signer)
            .registerOrganisation(name, uen, adminWalletAddress);
    }

    async getOrganisation(uen: string) {
        return this.systemContract.connect(this.signer).organisations(uen, {
            gasLimit: 2500000,
        });
    }
    // ---------

    async mintCertificateNFT(
        awardeeEmail: string,
        groupId: number,
        ipfsHash: string,
        uen: string
    ) {
        const organisation_addr = await this.getOrganisation(uen);
        const organisationContract = new ethers.Contract(
            organisation_addr,
            Organisation.abi,
            this.provider
        );
        return organisationContract
            .connect(this.signer)
            .awardCertificate(awardeeEmail, groupId, ipfsHash, {
                gasLimit: 2500000,
            });
    }

    retrieveCertificateInfo(certificateId: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                resolve({
                    awardeeName: 'Mark Tan Jun Xuan',
                    orgName: 'National University of Singapore',
                    certificateName: 'North Korean Fine Citizen Award',
                    dateOfIssue: '22/02/2022',
                    description:
                        "The School of Computing awards the following certificates of merit and distinction to help students highlight their areas of strength. For details on the criteria of the award, please click on the Issuer's Website link above.",
                });
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }
    retrieveProfileDetails(certificateId: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                resolve([
                    {
                        awardeeName: 'Mark Tan Jun Xuan',
                        orgName: 'National University of Singapore',
                        certificateName:
                            'IS Management Knkowledge Area (Distinction)',
                        dateOfIssue: '22/02/2022',
                        description:
                            "The School of Computing awards the following certificates of merit and distinction to help students highlight their areas of strength. For details on the criteria of the award, please click on the Issuer's Website link above.",
                        imageUrl:
                            'https://thumbs.dreamstime.com/b/certificate-template-diploma-letter-size-vector-vertical-62172702.jpg',
                    },
                    {
                        awardeeName: 'Mark Tan Jun Xuan',
                        orgName: 'National University of Singapore',
                        certificateName:
                            'ICT Solutioning Knowledge Area (Distinction)',
                        dateOfIssue: '22/02/2022',
                        description:
                            "The School of Computing awards the following certificates of merit and distinction to help students highlight their areas of strength. For details on the criteria of the award, please click on the Issuer's Website link above.",
                        imageUrl:
                            'https://thumbs.dreamstime.com/b/certificate-template-diploma-letter-size-vector-vertical-62172702.jpg',
                    },
                    {
                        awardeeName: 'Mark Tan Jun Xuan',
                        orgName: 'National University of Singapore',
                        certificateName: "Dean's List",
                        dateOfIssue: '22/02/2022',
                        description:
                            "The School of Computing awards the following certificates of merit and distinction to help students highlight their areas of strength. For details on the criteria of the award, please click on the Issuer's Website link above.",
                        imageUrl:
                            'https://thumbs.dreamstime.com/b/certificate-template-diploma-letter-size-vector-vertical-62172702.jpg',
                    },
                    {
                        awardeeName: 'Mark Tan Jun Xuan',
                        orgName: 'National University of Singapore',
                        certificateName: 'Orbital Apollo 11',
                        dateOfIssue: '22/02/2022',
                        description:
                            "The School of Computing awards the following certificates of merit and distinction to help students highlight their areas of strength. For details on the criteria of the award, please click on the Issuer's Website link above.",
                        imageUrl: '',
                    },
                    {
                        awardeeName: 'Mark Tan Jun Xuan',
                        orgName: 'National University of Singapore',
                        certificateName: 'North Korean Fine Citizen Award',
                        dateOfIssue: '22/02/2022',
                        description:
                            "The School of Computing awards the following certificates of merit and distinction to help students highlight their areas of strength. For details on the criteria of the award, please click on the Issuer's Website link above.",
                        imageUrl:
                            'https://thumbs.dreamstime.com/b/certificate-template-diploma-letter-size-vector-vertical-62172702.jpg',
                    },
                ]);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }
}

export default AppService;
