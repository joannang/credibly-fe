// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// import 'hardhat/console.sol';
import './Certificate.sol';
import './Awardee.sol';
import './WorkExperience.sol';

contract Organisation {

    string public name;
    string public uen;
    address public admin; // admin of this Organisation (the wallet address that is allowed to execute certain functions)

    // What Work Experiences does this Awardee have in this Organisation?
    // email => position => WorkExperience instance
    mapping (string => mapping (string => WorkExperience)) awardeesWorkExperiences;

    // What Certificates does this Awardee have in this Organisation?
    // certificateId (or GroupId) => Certificate instance
    mapping (string => Certificate) public certificateContracts;

    // Which Awardee contract instance belongs to the email address?
    // email => Awardee instance
    mapping (string => Awardee) public awardees;

    // List of Awardees registered in this Organisation
    Awardee[] public allAwardees;

    constructor(string memory _name, string memory _uen, address _admin) {
        name = _name;
        uen = _uen;
        admin = _admin;
    }

    modifier onlyAdmin { // only the admin wallet address can execute the function
        require(tx.origin == admin, "Unauthorised user.");
        _;
    }

    modifier awardeeExists(string memory email) { // Awardee instance must exist in this Organisation instance
        Awardee awardee = awardees[email];
        require(address(awardee) != address(0), "Awardee does not exist.");
        _;
    }

    modifier certificateExists(string memory certificateId) { // Certificate instance must exist in this Organisation instance
        Certificate certificate = certificateContracts[certificateId];
        require(address(certificate) != address(0), "Certificate does not exist.");
        _;
    }

    // Add Awardee Instance
    function addAwardee(
        string memory email,
        address awardeeContractAddress // CONTRACT ADDRESS of Awardee instance NOT WALLET ADDRESS of Awardee instance
    ) public {
        Awardee awardee = Awardee(awardeeContractAddress);
        awardees[email] = awardee;
        allAwardees.push(awardee);
    }

    // Update Email of Awardee Contract Instance
    function updateEmail(
        string memory oldEmail,
        string memory newEmail
    ) public awardeeExists(oldEmail) {
        awardees[newEmail] = awardees[oldEmail];
        delete awardees[oldEmail]; // delete old email mapping
    }

    // Create New Work Experience Contract Instance for Awardee Contract Instance
    function addWorkExperience(
        string memory email,
        string memory position,
        string memory description,
        uint256 startDate
    ) public onlyAdmin awardeeExists(email) {
        WorkExperience workExperience = new WorkExperience(name, position, description, startDate, admin); // Create new Work Experience instance
        awardeesWorkExperiences[email][position] = workExperience;
        Awardee awardee = awardees[email];
        awardee.addWorkExperience(address(workExperience)); // add Work Experince instance to Awardee instance
    }

    // Update End Date of Work Experience Contract Instance
    function endWorkExperience(
        string memory email,
        string memory position,
        uint256 endDate
    ) public onlyAdmin awardeeExists(email) {
        require (address(awardeesWorkExperiences[email][position]) != address(0), "Awardee Work Experience does not exist."); // requires Work Experience instance to exist
        WorkExperience workExperience = awardeesWorkExperiences[email][position];
        workExperience.setEndDate(endDate); // update end date of Work Experience instance
    }

    // Create New Certificate Contract Instance
    function addCertificate(
        string memory certificateName,
        string memory certificateId,
        string memory description
    ) public onlyAdmin {
        Certificate certificate = new Certificate(certificateName, certificateId, description, name, admin);
        certificateContracts[certificateId] = certificate;
    }

    // Award Certificate to Awardee
    // Mints Certificate NFT to Awardee
    function awardCertificate(
        string memory email,
        string memory certificateId,
        string memory ipfsHash // unique IPFS Hash containing certificate data
    ) public onlyAdmin awardeeExists(email) certificateExists(certificateId){
        Certificate certificate = certificateContracts[certificateId];
        Awardee awardee = awardees[email];
        uint256 tokenId = certificate.create(address(awardee), ipfsHash); // mint Certificate NFT to Awardee with the unique IPFS hash
        awardee.addCertificate(address(certificate), tokenId); // add Certificate NFT to Awardee instance
    }

    // Award Unique Certifcate NFTs to Each Awardee
    // Calls awardCertificates() method repeatedly
    function awardCertificates(
        string[] memory emails,
        string memory certificateId,
        string[] memory ipfsHashs
    ) public onlyAdmin {
        require(emails.length == ipfsHashs.length, "Invalid data."); // requires all array to be of equal length
        for (uint i = 0; i < emails.length; i++) {
            awardCertificate(emails[i], certificateId, ipfsHashs[i]);
        }
    }

    // Getter Functions
    function getAwardees() public view returns (Awardee[] memory) {
        return allAwardees;
    }

}