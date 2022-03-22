// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import './Certificate.sol';
import './Awardee.sol';

contract Organisation {

    string public name;
    string public uen;
    address public admin;

    mapping (string => WorkExperience[]) public awardeesWorkExperiences;
    mapping (string => Certificate) public certificateContracts;
    mapping (string => Awardee) public awardees;

    struct WorkExperience {
        string email;
        string name;
        string position;
        uint256 startDate;
        uint256 endDate;
        bool ended;
        // CertificateToken[] ownedCertificates; // UnimplementedFeatureError
    }

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
        string memory name,
        string memory position,
        uint256 startDate
    ) public {
        WorkExperience memory workExperience;
        workExperience.email = email;
        workExperience.name = name;
        workExperience.position = position;
        workExperience.startDate = startDate;
        awardeesWorkExperiences[email].push(workExperience);
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
        address awardeeContractAddress = address(awardee);
        // create certificate
        uint256 tokenId = certificate.create(awardeeContractAddress, url);
        awardee.addCertificate(awardeeContractAddress, tokenId);
    }

    // function transferAllCertificates(
    //     string memory email
    // ) public {
    //     Awardee awardee = awardees[email];
    //     CertificateToken[] memory certificateTokens = employeeCertificates[email];
    //     uint256 numCerts = certificateTokens.length;
    //     for (uint256 i = 0; i < numCerts; i++) {
    //         CertificateToken memory certificateToken = certificateTokens[i];
    //         Certificate certificate = certificateToken.certificate;


    //         uint256 tokenId = certificateToken.tokenId;
    //         certificate.transferOwnership(msg.sender, awardeeAddress, tokenId);
    //         // track using awardee contract
    //         awardee.addCertificate(address(certificate), tokenId);
    //     }
    // }
}