// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import './Certificate.sol';
import './Awardee.sol';

contract Organisation {

    string public name;
    string public uen;
    address public admin;

    // mapping (string => Employee) public employees;
    mapping (string => Certificate) public certificates;
    mapping (string => CertificateToken[]) public employeesCertificates;
    mapping (string => Awardee) public awardees;

    // struct Employee {
    //     string email;
    //     string name;
    //     string position;
    //     uint256 startDate;
    //     uint256 endDate;
    //     // CertificateToken[] ownedCertificates; // UnimplementedFeatureError
    // }

    struct CertificateToken{
        Certificate certificate;
        // address tokenAddress;
        // string name;
        // string certificateID;
        uint256 tokenID;
    }

    constructor(string memory _name, string memory _uen, address _admin) {
        name = _name;
        uen = _uen;
        admin = _admin;
    }

    // function addEmployee(
    //     string memory email,
    //     string memory name,
    //     string memory position,
    //     uint256 startDate
    // ) public {
    //     Employee memory employee;
    //     employee.email = email;
    //     employee.name = name;
    //     employee.position = position;
    //     employee.startDate = startDate;
    //     employees[email] = employee;
    // }

    function addAwardee(
        string memory email,
        address awardeeContractAddress // NOT WALLET ADDRESS 
    ) public {
        awardees[email] = Awardee(awardeeContractAddress);
    }

    function addCertificate(
        string memory name,
        // string memory symbol, // hardcode
        string memory certificateID
    ) public {
        // require admin
        Certificate certificate = new Certificate(name, "CREDIBLY", certificateID);
        certificates[certificateID] = certificate;
    }

    function awardCertificate(
        string memory email,
        string memory certificateID,
        string memory url
    ) public {
        // require admin
        Certificate certificate = certificates[certificateID];
        // create certificate
        uint256 tokenID = certificate.create(msg.sender, url);
        CertificateToken memory certificateToken = CertificateToken({
            certificate: certificate,
            tokenID: tokenID
        });
        // map certificate to employee
        employeesCertificates[email].push(certificateToken);
        // transfer cert to awardee if awardee has account
        if (address(awardees[email]) != address(0)) { // here
            certificate.transferOwnership(msg.sender, awardees[email].walletAddress(), tokenID);
            // track using awardee contract
            Awardee awardee = awardees[email];
            awardee.addCertificate(address(certificate), tokenID);
            // updateAwardeeCertificate(email, address(certificate), tokenID); // does not work
        }
    }

    // function updateAwardeeCertificate(
    //     string memory email,
    //     address certificateAddress,
    //     uint256 tokenID
    // ) public {
    //     awardees[email].addCertificate(certificateAddress, tokenID);
    // }

    function transferAllCertificates(
        string memory email,
        address awardeeAddress
    ) public {
        CertificateToken[] memory ownedCertificates = employeesCertificates[email];
        uint256 numCerts = ownedCertificates.length;
        for (uint256 i = 0; i < numCerts; i++) {
            CertificateToken memory certificateToken = ownedCertificates[i];
            Certificate certificate = certificateToken.certificate;
            uint256 tokenID = certificateToken.tokenID;
            certificate.transferOwnership(msg.sender, awardeeAddress, tokenID);
            // track using awardee contract
            Awardee awardee = awardees[email];
            awardee.addCertificate(address(certificate), tokenID);
        }
        // return ownedCertificates;
    }

    function getEmployeeCertificates(
        string memory email
    ) public returns (CertificateToken[] memory){
        return employeesCertificates[email];
    }

}