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

    console.log("Testing Workflow, not unit test");

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

    it ('Organisation1 Adds Work Experience for Awardee', async () => {
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
        let WorkExperience1Position = await WorkExperience1Instance.position();
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

})