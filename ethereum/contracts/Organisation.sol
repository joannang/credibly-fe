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

    mapping (string => WorkExperience[]) public awardeesWorkExperiences;
    mapping (string => Certificate) public certificateContracts;
    mapping (string => Awardee) public awardees;

    constructor(string memory _name, string memory _uen, address _admin) {
        name = _name;
        uen = _uen;
        admin = _admin;
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
    ) public {
        // require admin
        WorkExperience workExperience = new WorkExperience(name, description, position, startDate);
        awardeesWorkExperiences[email].push(workExperience);
        Awardee awardee = awardees[email];
        awardee.addWorkExperience(address(workExperience));
    }

    function addCertificate(
        string memory certificateName,
        string memory certificateId,
        string memory description
    ) public {
        // require admin
        Certificate certificate = new Certificate(certificateName, certificateId, description, name);
        certificateContracts[certificateId] = certificate;
    }

    function awardCertificate(
        string memory email,
        string memory certificateId,
        string memory url
    ) public {
        // require admin
        // require awardee to exist
        Certificate certificate = certificateContracts[certificateId];
        Awardee awardee = awardees[email];
        // create certificate
        uint256 tokenId = certificate.create(address(awardee), url);
        awardee.addCertificate(address(certificate), tokenId);
    }
}