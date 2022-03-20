// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import './Certificate.sol';
import './Awardee.sol';

contract Organisation {

    string public name;
    string public uen;
    address public admin;

    mapping (string => WorkExperience) public workExperiences;
    mapping (string => Certificate) public certificateContracts;
    mapping (string => CertificateToken[]) public employeeCertificates;
    mapping (string => Awardee) public awardees;

    struct WorkExperience {
        string email;
        string name;
        string position;
        uint256 startDate;
        uint256 endDate;
        // CertificateToken[] ownedCertificates; // UnimplementedFeatureError
    }

    struct CertificateToken{
        Certificate certificate;
        uint256 tokenId;
    }

    constructor(string memory _name, string memory _uen, address _admin) {
        name = _name;
        uen = _uen;
        admin = _admin;
    }

    function addWorkExperience(
        string memory email,
        string memory name,
        string memory position,
        uint256 startDate
    ) public {
        WorkExperience memory workExperience;
        workExperience.email = email;
        workExperience.name = name;
        workExperience.position = position;
        workExperience.startDate = startDate;
        workExperiences[email] = workExperience;
    }

    function addAwardee(
        string memory email,
        address awardeeContractAddress // NOT WALLET ADDRESS 
    ) public {
        awardees[email] = Awardee(awardeeContractAddress);
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
        Certificate certificate = certificateContracts[certificateId];
        // create certificate
        uint256 tokenId = certificate.create(msg.sender, url);
        CertificateToken memory certificateToken = CertificateToken({
            certificate: certificate,
            tokenId: tokenId
        });
        // map certificate to employee
        employeeCertificates[email].push(certificateToken);
        // transfer cert to awardee if awardee has account
        if (address(awardees[email]) != address(0)) {
            certificate.transferOwnership(msg.sender, awardees[email].walletAddress(), tokenId);
            // track using awardee contract
            Awardee awardee = awardees[email];
            awardee.addCertificate(address(certificate), tokenId);
        }
    }

    function transferAllCertificates(
        string memory email,
        address awardeeAddress
    ) public {
        CertificateToken[] memory ownedCertificates = employeeCertificates[email];
        uint256 numCerts = ownedCertificates.length;
        for (uint256 i = 0; i < numCerts; i++) {
            CertificateToken memory certificateToken = ownedCertificates[i];
            Certificate certificate = certificateToken.certificate;
            uint256 tokenId = certificateToken.tokenId;
            certificate.transferOwnership(msg.sender, awardeeAddress, tokenId);
            // track using awardee contract
            Awardee awardee = awardees[email];
            awardee.addCertificate(address(certificate), tokenId);
        }
    }

    function getEmployeeCertificates(
        string memory email
    ) public returns (CertificateToken[] memory){
        return employeeCertificates[email];
    }

}