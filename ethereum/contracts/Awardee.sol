// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Certificate.sol';
import './WorkExperience.sol';

contract Awardee {
    string public email;
    string public name;
    address public walletAddress;
    CertificateToken[] certificates;
    Certificate[] certificateContracts;
    uint256[] certificateTokenIds;
    WorkExperience[] workExperiences;
    mapping (address => bool) public accessRights;
    bool public linkedWalletAddress;

    struct CertificateToken{
        Certificate certificate;
        uint256 tokenId;
    }

    modifier privacySettings {
        if (linkedWalletAddress) {
            require (msg.sender == walletAddress || accessRights[msg.sender] == true, "Unauthorised user.");
        }
        _;
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
        uint256 tokenId
    ) public {
        CertificateToken memory certificateToken = CertificateToken({
            certificate: Certificate(certificateAddress),
            tokenId: tokenId
        });
        certificates.push(certificateToken);
    }

    // function addCertificate(
    //     address certificateAddress,
    //     uint256 tokenId
    // ) public {
    //     certificateContracts.push(Certificate(certificateAddress));
    //     certificateTokenIds.push(tokenId);
    // }

    function getCertificates() public view privacySettings returns (CertificateToken[] memory){
        return certificates;
    }
    // function getCertificates() public view privacySettings returns (Certificate[] memory, uint256[] memory){
    //     return (certificateContracts, certificateTokenIds);
    // }

    function addWorkExperience(
        address workExperienceAddress
    ) public {
        workExperiences.push(WorkExperience(workExperienceAddress));
    }

    function getWorkExperiences() public view privacySettings returns (WorkExperience[] memory){
        return workExperiences;
    }

}

