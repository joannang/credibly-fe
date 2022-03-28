// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// import 'hardhat/console.sol';
import './Certificate.sol';
import './Awardee.sol';
import './WorkExperience.sol';

contract Organisation {

    string public name;
    string public uen;
    address public admin;

    mapping (string => WorkExperience[]) awardeesWorkExperiences;
    mapping (string => Certificate) public certificateContracts;
    mapping (string => Awardee) public awardees;

    constructor(string memory _name, string memory _uen, address _admin) {
        name = _name;
        uen = _uen;
        admin = _admin;
    }

    modifier onlyAdmin {
        require(tx.origin == admin, "Unauthorised user.");
        _;
    }

    modifier awardeeExists(string memory email) {
        Awardee awardee = awardees[email];
        require(address(awardee) != address(0), "Awardee does not exist.");
        _;
    }

    modifier certificateExists(string memory certificateId) {
        Certificate certificate = certificateContracts[certificateId];
        require(address(certificate) != address(0), "Certificate does not exist.");
        _;
    }

    function addAwardee(
        string memory email,
        address awardeeContractAddress // NOT WALLET ADDRESS 
    ) public {
        awardees[email] = Awardee(awardeeContractAddress);
    }

    function addWorkExperience(
        string memory email,
        string memory position,
        string memory description,
        uint256 startDate
    ) public onlyAdmin awardeeExists(email) {
        WorkExperience workExperience = new WorkExperience(name, position, description, startDate);
        awardeesWorkExperiences[email].push(workExperience);
        Awardee awardee = awardees[email];
        awardee.addWorkExperience(address(workExperience));
    }

    function addCertificate(
        string memory certificateName,
        string memory certificateId,
        string memory description
    ) public onlyAdmin {
        Certificate certificate = new Certificate(certificateName, certificateId, description, name);
        certificateContracts[certificateId] = certificate;
    }

    function awardCertificate(
        string memory email,
        string memory certificateId,
        string memory ipfsHash
    ) public onlyAdmin awardeeExists(email) certificateExists(certificateId){
        Certificate certificate = certificateContracts[certificateId];
        Awardee awardee = awardees[email];
        uint256 tokenId = certificate.create(address(awardee), ipfsHash);
        awardee.addCertificate(address(certificate), tokenId);
    }
}