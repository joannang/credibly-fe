const _deploy_contracts = require("../migrations/2_deploy_contracts");
const truffleAssert = require('truffle-assertions');
var assert = require('assert');

var System = artifacts.require("../contracts/System.sol");
var Organisation = artifacts.require("../contracts/Organisation.sol");
var WorkExperience = artifacts.require("../contracts/WorkExperience.sol");
var Awardee = artifacts.require("../contracts/Awardee.sol");
var Certificate = artifacts.require("../contracts/Certificate.sol");

contract('System', function(accounts) {

    before(async () => {
        SystemInstance = await System.deployed();
    });

    console.log("Testing Workflow. These are not unit tests.");

    it ('System Creates Organisation', async () => {
        let uen = 'uen1';
        let organisation = 'organisation1';
        let admin = accounts[1];
        // register organisation
        await SystemInstance.registerOrganisation(organisation, uen, admin);
        // check if organisation instance is created
        let Organisation1Address = await SystemInstance.organisations(uen);
        let Organisation1Instance = await Organisation.at(Organisation1Address);
        let Organisation1Name = await Organisation1Instance.name();
        assert.equal(Organisation1Name, organisation);
    })

    it ('System Adds Awardee to Organisation', async () => {
        let uen = 'uen1';
        let awardee = 'awardee1';
        let email = 'email1';
        // add awardee to organisation
        await SystemInstance.addAwardeeToOrganisation(uen, email, awardee);
        // check if awardee instance is created
        let Awardee1Address = await SystemInstance.awardees(email);
        let Awardee1Instance = await Awardee.at(Awardee1Address);
        let Awardee1Name = await Awardee1Instance.name();
        assert.equal(Awardee1Name, awardee);
        // check if awardee is added to organisation
        let Organisation1Address = await SystemInstance.organisations(uen);
        let Organisation1Instance = await Organisation.at(Organisation1Address);
        let Organisation1AwardeeAddress = await Organisation1Instance.awardees(email)
        assert.equal(Organisation1AwardeeAddress, Awardee1Address);
    })

    it ('Organisation Adds Work Experience for Awardee', async () => {
        let uen = 'uen1'
        let email = 'email1';
        let position = 'position1';
        let description = 'description1';
        let startDate = '01012022';
        let admin = accounts[1];
        // get instance of organisation1
        let Organisation1Address = await SystemInstance.organisations(uen);
        let Organisation1Instance = await Organisation.at(Organisation1Address);
        // add work experience for awardee using admin account
        await Organisation1Instance.addWorkExperience(email, position, description, startDate, {from: admin});
        // get instance of awardee1
        let Awardee1Address = await SystemInstance.awardees(email);
        let Awardee1Instance = await Awardee.at(Awardee1Address);
        // check if work experience is added to awardee
        let Awardee1WorkExperiences = await Awardee1Instance.getWorkExperiences();
        let Awardee1WorkExperience1 = await Awardee1WorkExperiences[0]
        let WorkExperience1Instance = await WorkExperience.at(Awardee1WorkExperience1);
        let WorkExperience1Data = await WorkExperience1Instance.data();
        let WorkExperience1Position = await WorkExperience1Data.position;
        assert.equal(WorkExperience1Position, position);
    })

    it ('Organisation Creates Certificate Contract', async () => {
        let uen = 'uen1'
        let id = 'id1';
        let name = 'certificate1';
        let description = 'description1'
        let admin = accounts[1];
        // get instance of organisation1
        let Organisation1Address = await SystemInstance.organisations(uen);
        let Organisation1Instance = await Organisation.at(Organisation1Address);
        // organisation creates certificate contract using admin account
        await Organisation1Instance.addCertificate(name, id, description, {from: admin});
        // check if certificate is created
        let certificate1Address = await Organisation1Instance.certificateContracts(id);
        let certificate1Instance = await Certificate.at(certificate1Address);
        let certificate1Id = await certificate1Instance.certificateId();
        assert.equal(certificate1Id, id);
    })

    it ('Organisation Awards Certificate to Awardee', async () => {
        let uen = 'uen1'
        let id = 'id1';
        let email = 'email1';
        let ipfsHash = 'ipfsHash1';
        let admin = accounts[1];
        // get instance of organisation1
        let Organisation1Address = await SystemInstance.organisations(uen);
        let Organisation1Instance = await Organisation.at(Organisation1Address);
        // organisation creates certificate NFT using admin account
        await Organisation1Instance.awardCertificate(email, id, ipfsHash, {from: admin});
        // get instance of awardee1
        let Awardee1Address = await SystemInstance.awardees(email);
        let Awardee1Instance = await Awardee.at(Awardee1Address);
        // check if certificate is awarded to awardee
        let Awardee1Certificates = await Awardee1Instance.getCertificates();
        let Awardee1Certificate1 = await Awardee1Certificates[0];
        let Certificate1Instance = await Certificate.at(Awardee1Certificate1.certificate);
        let Certificate1IpfsHash = await Certificate1Instance.tokenURI(Awardee1Certificate1.tokenId)
        assert.equal(Certificate1IpfsHash, ipfsHash);
    })

    it ('Get Work Experiences of Unlinked Awardee Account', async () => {
        let email = 'email1';
        // get instance of awardee1
        let Awardee1Address = await SystemInstance.awardees(email);
        let Awardee1Instance = await Awardee.at(Awardee1Address);
        // get array of work experiences
        Awardee1WorkExperiences = await Awardee1Instance.getWorkExperiences()
        // loop through array of work experiences to retrieve data
        for (let i = 0; i < Awardee1WorkExperiences.length; i++) {
            let Awardee1WorkExperience = await Awardee1WorkExperiences[i];
            let WorkExperienceInstance = await WorkExperience.at(Awardee1WorkExperience);
            console.log(await WorkExperienceInstance.data());
        }
    })

    it ('Get Certificates of Unlinked Awardee Account', async () => {
        let email = 'email1';
        // get instance of awardee1
        let Awardee1Address = await SystemInstance.awardees(email);
        let Awardee1Instance = await Awardee.at(Awardee1Address);
        // get array of certificates
        let Awardee1Certificates = await Awardee1Instance.getCertificates();
        // loop through array of certificates to retrieve data
        for (let i = 0; i < Awardee1WorkExperiences.length; i++) {
            let Awardee1Certificate = await Awardee1Certificates[i];
            let CertificateInstance = await Certificate.at(Awardee1Certificate.certificate);
            console.log(await CertificateInstance.getData(Awardee1Certificate.tokenId)); // returns ipfsHash, description, organisation
        }
    })

    it ('Link Wallet Address to Awardee Account', async () => {
        let email = 'email1';
        let name = 'name';
        let walletAddress = accounts[2];
        // link wallet address to awardee account
        await SystemInstance.linkAwardee(email, name, {from: walletAddress});
        // get instance of awardee1
        let Awardee1Address = await SystemInstance.awardees(email);
        let Awardee1Instance = await Awardee.at(Awardee1Address);
        // check if wallet address is linked to awardee account
        assert.equal(await Awardee1Instance.linkedWalletAddress(), true);
        assert.equal(await Awardee1Instance.walletAddress(), walletAddress);
    })

    it ('Set Public Visibility of Data to false (Only owner and approved users can view)', async () => {
        let email = 'email1';
        let walletAddress = accounts[2];
        // get instance of awardee1
        let Awardee1Address = await SystemInstance.awardees(email);
        let Awardee1Instance = await Awardee.at(Awardee1Address);
        // set public visibility of data to false
        await Awardee1Instance.setVisibility(false, {from: walletAddress})
        // check that unauthorised users (neither owner nor approved users) cannot access functions to view data
        await truffleAssert.reverts(Awardee1Instance.getCertificates(), "Unauthorised user.")
        await truffleAssert.reverts(Awardee1Instance.getWorkExperiences(), "Unauthorised user.")
    })


})