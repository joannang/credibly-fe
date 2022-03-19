import { ethers, Contract, ContractTransaction } from 'ethers';
import {
    JsonRpcProvider,
    Web3Provider,
    JsonRpcSigner,
} from '@ethersproject/providers';
import { ENDPOINT } from '../settings';
import restGet from '../lib/restGet';
import restPost from '../lib/restPost';
import { RegisterAccountType, RegisterUploadType, AwardeeType } from './AppStore';
import { MARKET_ADDRESS } from '../settings';
import Market from '../../ethereum/artifacts/contracts/Market.sol/Market.json';

declare global {
    interface Window {
        ethereum: any;
    }
}

interface AppService {
    provider: JsonRpcProvider | Web3Provider; // ethers provider
    signer: JsonRpcSigner;
    factory: Contract; // factory contract instance
    supplierContract: Contract;
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
        this.factory = new ethers.Contract(
            MARKET_ADDRESS,
            Market.abi,
            this.provider
        );
    }

    /**
     * need to (1) post the list of awardees into the awardee table first and store the ids from the return
     * then (2) post the awardees to the group with org id, group id, and list of the awardee ids
     */
    createAwardeesAsync(organisationId: number, awardees: AwardeeType[], accessToken: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const data = {
                    organisationId: organisationId,
                    awardees: awardees,
                };

                const response = await restPost({
                    endpoint: ENDPOINT + '/awardee/create',
                    data: data,
                    credentials: { accessToken }
                });
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

    uploadCertificateTemplateAsync(certificateTemplateName: string, image: File, organisationId: number): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/certificateTemplate/create`,
                    data: {
                        certificateName: certificateTemplateName,
                        image: image,
                        organisationId: organisationId
                    },
                    formData: true
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    getCertificateTemplatesAsync(organisationId: number): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restGet({
                    endpoint: `${ENDPOINT}/certificateTemplate/organisation/${organisationId}`,
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    deleteCertificateTemplateAsync(certificateName: string, organisationId: number): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/certificateTemplate/delete`,
                    data: {
                        certificateName: certificateName,
                        organisationId: organisationId
                    },
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
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
                    data: accountDetails
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
                        document: registerUpload.documents
                    },
                    formData: true
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
                    data
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
                    credentials: { accessToken }
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
                    credentials: { accessToken }
                });
                resolve(response.data);
            } catch (err) {
                reject(err.response.data.error);
            }
        });
    }

    approveAccounts(approverId: number, userIds: number[], accessToken: string): any {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await restPost({
                    endpoint: `${ENDPOINT}/user/approve`,
                    data: { approverId, userIds },
                    credentials: { accessToken }
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
    async getLastTokenId() {
        return this.factory.connect(this.signer).lastTokenID();
    }

    async buyFoodAsync(
        foodId: string,
        price: number
    ): Promise<ContractTransaction> {
        price = Math.floor((price * 1038114374) / 3300);
        return this.factory.connect(this.signer).buyFood(foodId, {
            value: ethers.utils.parseUnits(price.toString(), 'gwei'),
            gasLimit: 2500000,
        });
    }
}

export default AppService;
