// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Certificate.sol';
import './WorkExperience.sol';

contract Awardee {
    string public email;
    string public name;
    address public walletAddress; // wallet address of Awardee (wallet address of the owner of this email address)
    CertificateToken[] certificates; // list of Certificate Token struct instances under this Awardee instance
    WorkExperience[] workExperiences; // list of Work Experience instances under this Awardee instance
    bool public linkedWalletAddress; // has the Awardee linked their wallet address to this Awardee instance?
    bool public publicVisibility; // are the Certificates and Work Experiences publically visible?
    mapping (address => bool) accessRights; // which wallet addresses are given access rights to view the Certificates and Work Experience instances under this Awardee instance?

    struct CertificateToken{
        Certificate certificate; // Certificate NFT
        uint256 tokenId; // unique token Id of Certificate NFT
    }

    modifier privacySettings { // who can execute the function?
        if (linkedWalletAddress) { // if the Awardee has linked their wallet address to this Awardee instance (AKA registered for an account with Credibly)
            // if public visibility is set to true, anyone can execute the function
            // OR wallet address of the Awardee can execute the function
            // OR wallet addresses that were given access rights can execute the function
            require (publicVisibility == true || tx.origin == walletAddress || accessRights[tx.origin] == true, "Unauthorised user.");
        }
        _;
    }

    modifier onlyOwner { // only the wallet address of the Awardee can execute the function
        require(tx.origin == walletAddress, "Unauthorised user.");
        _;
    }

    constructor(string memory _email, string memory _name) {
        email = _email;
        name = _name;
        publicVisibility = true;
    }

    // Link Awardee Contract Instance to Wallet Address
    function setWalletAddress(
        address _walletAddress
    ) public {
        require(linkedWalletAddress == false);
        walletAddress = _walletAddress;
        linkedWalletAddress = true;
    }

    // Update Email of Awardee
    function updateEmail(string memory newEmail) public onlyOwner {
        email = newEmail;
    }

    // Set Public Visibility of Certificates and Work Experiences Contract Instances
    function setVisibility(bool visible) public onlyOwner {
        publicVisibility = visible;
    }

    // Give Access Rights to Wallet Address
    function addAccessRights(address user) public onlyOwner {
        accessRights[user] = true;
    }

    // Remove Access Rights from Wallet Address
    function removeAccessRights(address user) public onlyOwner {
        accessRights[user] = false;
    }

    // Add Certificate Contract Instances to certificates Mapping
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

    // Add Work Experience Contract Instances to workExperiences Mapping
    function addWorkExperience(
        address workExperienceAddress
    ) public {
        workExperiences.push(WorkExperience(workExperienceAddress));
    }

    // Getter Functions

    function getCertificates() public view privacySettings returns (CertificateToken[] memory){
        return certificates;
    }

    function getWorkExperiences() public view privacySettings returns (WorkExperience[] memory){
        return workExperiences;
    }

}

