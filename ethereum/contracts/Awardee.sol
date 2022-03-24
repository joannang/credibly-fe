// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Certificate.sol';
import './WorkExperience.sol';

contract Awardee {
    string public email;
    string public name;
    address public walletAddress;
    CertificateToken[] public certificates;
    WorkExperience[] public workExperiences;
    address[] public accessRights;
    bool public privacy;

    struct CertificateToken{
        Certificate certificate;
        uint256 tokenID;
    }

    constructor(string memory _email, string memory _name) {
        email = _email;
        name = _name;
    }

    function setWalletAddress(
        address _walletAddress
    ) public {
        // (require) wallet address to be address(0)
        walletAddress = _walletAddress;
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

    function getCertificates() public view returns (CertificateToken[] memory){
        return certificates;
    }

    function addWorkExperience(
        address workExperienceAddress
    ) public {
        workExperiences.push(WorkExperience(workExperienceAddress));
    }

}