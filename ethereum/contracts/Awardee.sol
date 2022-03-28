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
    bool public linkedWalletAddress;
    bool publicVisibility;
    mapping (address => bool) public accessRights;

    struct CertificateToken{
        Certificate certificate;
        uint256 tokenId;
    }

    modifier privacySettings {
        if (linkedWalletAddress) {
            require (publicVisibility == true || tx.origin == walletAddress || accessRights[tx.origin] == true, "Unauthorised user.");
        }
        _;
    }

    modifier onlyOwner {
        require(tx.origin == walletAddress, "Unauthorised user.");
        _;
    }

    constructor(string memory _email, string memory _name) {
        email = _email;
        name = _name;
        publicVisibility = true;
    }

    function updateEmail(string memory newEmail) public onlyOwner {
        email = newEmail;
    }

    function setVisibility(bool visible) public onlyOwner {
        publicVisibility = visible;
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
        uint256 tokenId
    ) public {
        CertificateToken memory certificateToken = CertificateToken({
            certificate: Certificate(certificateAddress),
            tokenId: tokenId
        });
        certificates.push(certificateToken);
    }

    function getCertificates() public view privacySettings returns (CertificateToken[] memory){
        return certificates;
    }

    function addWorkExperience(
        address workExperienceAddress
    ) public {
        workExperiences.push(WorkExperience(workExperienceAddress));
    }

    function getWorkExperiences() public view privacySettings returns (WorkExperience[] memory){
        return workExperiences;
    }

}

