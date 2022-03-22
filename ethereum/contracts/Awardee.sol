// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Certificate.sol';

contract Awardee {
    string public email;
    address public walletAddress;
    CertificateToken[] public certificates;
    // WorkExperienceToken[] public workExperiences;
    address[] public accessRights;
    bool public privacy;

    struct CertificateToken{
        Certificate certificate;
        uint256 tokenID;
    }

    // struct workExperienceToken{
    //     WorkExperiences workExperience;
    //     uint256 tokenID;
    // }

    constructor(string memory email) {
        email = email;
    }

    function setWalletAddress(
        string memory walletAddress
    ) public {
        // (require) wallet address to be address(0)
        walletAddress = walletAddress;
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

}