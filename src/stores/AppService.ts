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
import Certificate from '../../ethereum/build/contracts/Certificate.json';
import Organisation from '../../ethereum/build/contracts/Organisation.json';
import Awardee from '../../ethereum/build/contracts/Awardee.json';
import System from '../../ethereum/build/contracts/System.json';
import WorkExperience from '../../ethereum/build/contracts/WorkExperience.json';
import { create, IPFSHTTPClient } from 'ipfs-http-client';

declare global {
    interface Window {
        ethereum: any;
        ipfs?: any;
    }
}

const projectId = '26bbuL0MXuph9BdyJbp4ZefpS34';
const projectSecret = '2263bf12ad5bbe8ac4a1106387fe5737';
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
interface AppService {
    provider: JsonRpcProvider | Web3Provider; // ethers provider
    signer: JsonRpcSigner;
    certificateContract: Contract; // factory contract instance
    systemContract: Contract;
    supplierContract: Contract;
    ipfsClient: IPFSHTTPClient;
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

        this.systemContract = new ethers.Contract(
            SYSTEM_ADDRESS,
            System.abi,
            this.provider
        );

        this.ipfsClient = create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            headers: {
                authorization: auth,
            },
        });
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

    getAwardeesFromOrganisationAsync(orgId: number, accessToken: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: ENDPOINT + `/awardee/organisation/${orgId}`,
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
        organisationId: number,
        accessToken: string
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/certificateTemplate/delete`,
                    data: {
                        certificateName: certificateName,
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

    searchAwardeesAsync(query: string, accessToken: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/awardee/search`,
                    data: {
                        query: query,
                    },
                    credentials: { accessToken },
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

    loginAsync(email: string, password: string, walletAddress: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const data = { email, password, walletAddress };
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

    getPendingTransferRequests(id: number, accessToken: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: `${ENDPOINT}/transferRequest/pendingApprovals`,
                    _id: `${id}`,
                    credentials: { accessToken },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    approveTransferRequests(
        approverId: number,
        transferRequestIds: number[],
        accessToken: string
    ): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/transferRequest/approve`,
                    data: { approverId, transferRequestIds },
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

    // SMART CONTRACT CALLS
    async addAwardeeToOrganisation(
        uen: string,
        email: string,
        awardee: string
    ) {
        return this.systemContract
            .connect(this.signer)
            .addAwardeeToOrganisation(uen, email, awardee);
    }

    async getEmployeesFromOrganisation(uen: string) {
        const organisation_addr = await this.getOrganisation(uen);
        const organisationContract = new ethers.Contract(
            organisation_addr,
            Organisation.abi,
            this.provider
        );
        const awardeeAddresses = await organisationContract.connect(this.signer).getAwardees();
        const awardees: {name?: string, email?: string}[] = [];
        for (let i = 0; i < awardeeAddresses.length; i++) {
            const awardeeContract = new ethers.Contract(
                awardeeAddresses[i],
                Awardee.abi,
                this.provider
            );
            const email = await awardeeContract
                .connect(this.signer)
                .email(); 
            const name = await awardeeContract.connect(this.signer).name();
            awardees.push({name: name, email: email});
        }

        return awardees;
    }

    async bulkAddAwardeesToOrganisation(
        uen: string,
        emails: string[],
        names: string[]
    ) {
        return this.systemContract
            .connect(this.signer)
            .addAwardeesToOrganisation(uen, emails, names, {
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

    async getAwardeeContractAddr(email: string) {
        return this.systemContract.connect(this.signer).awardees(email);
    }

    async getWorkExperiences(email: string) {
        const awardee_addr = await this.getAwardeeContractAddr(email);
        const awardeeContract = new ethers.Contract(
            awardee_addr,
            Awardee.abi,
            this.provider
        );

        let workExperiences = [];

        const workExpAddresses = await awardeeContract
            .connect(this.signer)
            .getWorkExperiences();
        console.log(workExpAddresses);
        for (let i = 0; i < workExpAddresses.length; i++) {
            const workExpContract = new ethers.Contract(
                workExpAddresses[i],
                WorkExperience.abi,
                this.provider
            );
            const workExp = await workExpContract
                .connect(this.signer)
                .details(); 
            console.log(workExp);
            workExperiences.push(workExp);
        }

        return workExperiences;
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
            .addWorkExperience(email, position, description, startDate, {
                gasLimit: 2500000,
            });
    }

    async endWorkExperience(
        email: string,
        position: string,
        endDate: string,
        uen: string
    ) {
        const organisation_addr = await this.getOrganisation(uen);
        const organisationContract = new ethers.Contract(
            organisation_addr,
            Organisation.abi,
            this.provider
        );
        return organisationContract.connect(this.signer).endWorkExperience(email, position, endDate, {
            gasLimit: 2500000,
        });
    }

    async getOrganisation(uen: string) {
        return this.systemContract.connect(this.signer).organisations(uen, {
            gasLimit: 2500000,
        });
    }

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

    async bulkAwardCertificates(
        uen: string,
        emails: string[],
        groupId: number,
        ipfsHashes: string[]
    ) {
        const organisation_addr = await this.getOrganisation(uen);
        const organisationContract = new ethers.Contract(
            organisation_addr,
            Organisation.abi,
            this.provider
        );
        return organisationContract
            .connect(this.signer)
            .awardCertificates(emails, groupId, ipfsHashes, {
                gasLimit: 2500000,
            });
    }

    async retrieveCertificateInfo(tokenId: number) {
        var res: [string, string, string] = await this.certificateContract
            .connect(this.signer)
            .getData(tokenId);

        const chunks = [];
        for await (const chunk of this.ipfsClient.cat(res[0])) {
            chunks.push(chunk);
        }
        console.log(Buffer.concat(chunks).toString());
        return {
            awardeeName: 'John Doe',
            description: res[1],
            orgName: res[2],
            certificateName: 'North Korean Fine Citizen Award',
            dateOfIssue: '22/02/2022',
        };
        // return new Promise(async (resolve, reject) => {
        //     try {
        //         resolve({
        //             awardeeName: 'Mark Tan Jun Xuan',
        //             orgName: 'National University of Singapore',
        //             certificateName: 'North Korean Fine Citizen Award',
        //             dateOfIssue: '22/02/2022',
        //             description:
        //                 "The School of Computing awards the following certificates of merit and distinction to help students highlight their areas of strength. For details on the criteria of the award, please click on the Issuer's Website link above.",
        //         });
        //     } catch (err) {
        //         reject(err.response.data.error);
        //     }
        // });
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

    async registerOrganisation(
        name: string,
        uen: string,
        admin: string
    ) {
        console.log(name, uen, admin);
        return this.systemContract
            .connect(this.signer)
            .registerOrganisation(name, uen, admin, {
                gasLimit: 2500000
            });
    }

    async registerAwardee(
        email: string,
        name: string
    ) {
        return this.systemContract
            .connect(this.signer)
            .linkAwardee(email, name);
    }

    async getProfileVisibility(email: string) {
        const awardee_addr = await this.getAwardeeContractAddr(email);
        const awardeeContract = new ethers.Contract(
            awardee_addr,
            Awardee.abi,
            this.provider
        );
        return awardeeContract.connect(this.signer).publicVisibility();
    }

    async setProfileVisibility(email: string, isProfileVisible: boolean) {
        const awardee_addr = await this.getAwardeeContractAddr(email);
        const awardeeContract = new ethers.Contract(
            awardee_addr,
            Awardee.abi,
            this.provider
        );
        return awardeeContract.connect(this.signer).setVisibility(isProfileVisible);
    }

    async getAuthorisedUsers(email: string) {
        const awardee_addr = await this.getAwardeeContractAddr(email);
        const awardeeContract = new ethers.Contract(
            awardee_addr,
            Awardee.abi,
            this.provider
        );
        const authorisedUsers = await awardeeContract.connect(this.signer).getApprovedAccess()
        return authorisedUsers
    }

    async addAuthorisedUser(email: string, authorisedUserWalletAddress: string) {
        const awardee_addr = await this.getAwardeeContractAddr(email);
        const awardeeContract = new ethers.Contract(
            awardee_addr,
            Awardee.abi,
            this.provider
        );

        authorisedUserWalletAddress = ethers.utils.getAddress(authorisedUserWalletAddress)
        await awardeeContract.connect(this.signer).addAccessRights(authorisedUserWalletAddress)
    }

    async removeAuthorisedUser(email: string, authorisedUserWalletAddress: string) {
        const awardee_addr = await this.getAwardeeContractAddr(email);
        const awardeeContract = new ethers.Contract(
            awardee_addr,
            Awardee.abi,
            this.provider
        );

        authorisedUserWalletAddress = ethers.utils.getAddress(authorisedUserWalletAddress)
        await awardeeContract.connect(this.signer).removeAccessRights(authorisedUserWalletAddress)
    }
}

export default AppService;
