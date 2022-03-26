// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Certificate.sol';
import './WorkExperience.sol';

contract Awardee {
    string public email;
    string public name;
    address public walletAddress;
    CertificateToken[] certificates;
    WorkExperience[] workExperiences;
    mapping (address => bool) accessRights;
    bool public linkedWalletAddress;

    struct CertificateToken{
        Certificate certificate;
        uint256 tokenID;
    }

    modifier privacySettings {
        if (linkedWalletAddress) {
            require (msg.sender == walletAddress || accessRights[msg.sender] == true, "Unauthorised user.");
            _;
        }
    }

    modifier onlyOwner {
        require(msg.sender == walletAddress, "Unauthorised user.");
        _;
    }

    constructor(string memory _email, string memory _name) {
        email = _email;
        name = _name;
    }

    function addAccessRights(address user) public onlyOwner {
        accessRights[user] = true;
    }

    function removeAccessRights(address user) public onlyOwner {
        accessRights[user] = false;
    }

    function setWalletAddress(
        address _walletAddress
    ) public {
        require(linkedWalletAddress == false);
        walletAddress = _walletAddress;
        linkedWalletAddress = true;
    }

    function addCertificate(
        address certificateAddress,
        uint256 tokenID
    ) public {
        CertificateToken memory certificateToken = CertificateToken({
            certificate: Certificate(certificateAddress),
            tokenID: tokenID
        });
        certificates.push(certificateToken);
    }

    function getCertificates() public view privacySettings returns (CertificateToken[] memory){ // cannot return structs
        return certificates;
    }

    function addWorkExperience(
        address workExperienceAddress
    ) public {
        workExperiences.push(WorkExperience(workExperienceAddress));
    }

    function getWorkExperiences() public view privacySettings returns (WorkExperience[] memory){ // cannot return structs
        return workExperiences;
    }

}