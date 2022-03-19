// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Certificate.sol';

contract Awardee {
    string public email;
    address public walletAddress;
    CertificateToken[] public certificates;
    address[] public accessRights;
    bool public privacy;

    struct CertificateToken{
        Certificate certificate;
        uint256 tokenID;
    }

    constructor(string memory email, address walletAddress) {
        email = email;
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

    // function getWalletAddress() view returns (address) {
    //     return walletAddress;
    // }


}