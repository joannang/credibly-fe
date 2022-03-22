// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Certificate.sol';

contract Awardee {
    string public email;
    string public name;
    address public walletAddress;
    CertificateToken[] public certificates;
    // WorkExperienceToken[] public workExperiences;
    address[] public accessRights;
    bool public privacy;

    // struct workExperienceToken{
    //     WorkExperiences workExperience;
    //     uint256 tokenID;
    // }

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

}