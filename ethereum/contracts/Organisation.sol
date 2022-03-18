// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Certificate.sol';

contract Organisation {

    string public name;
    string public uen;
    address public admin;

    mapping (string => Employee) public employees;
    mapping (string => Certificate) public certificates;
    mapping (string => CertificateToken[]) public ownedCertificates;

    struct Employee {
        string email;
        string name;
        string position;
        uint256 startDate;
        uint256 endDate;
        // CertificateToken[] ownedCertificates; // UnimplementedFeatureError
    }

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

    function addEmployee(
        string memory email,
        string memory name,
        string memory position,
        uint256 startDate
    ) public {
        Employee memory employee;
        employee.email = email;
        employee.name = name;
        employee.position = position;
        employee.startDate = startDate;
        // Employee memory employee = Employee({
        //     email: email,
        //     name: name,
        //     position: position,
        //     startDate: startDate,
        //     endDate: 0,
        //     ownedCertificates: new CertificateToken[](0)
        // });
        employees[email] = employee;
    }

    function addCertificate(
        string memory name,
        string memory symbol,
        string memory certificateID
    ) public {
        Certificate certificate = new Certificate(name, symbol, certificateID);
        certificates[certificateID] = certificate;
    }

    function awardCertificate(
        string memory email,
        string memory certificateID,
        string memory url
    ) public {
        Certificate certificate = certificates[certificateID];
        // create certificate
        uint256 tokenID = certificate.create(admin, url);
        CertificateToken memory certificateToken = CertificateToken({
            certificate: certificate,
            tokenID: tokenID
        });
        // map certificate to employee
        ownedCertificates[email].push(certificateToken);
    }

    function transferCertificate(
        address awardee,
        string memory email
    ) public {
        // approve transfer from  // how??? // HR system as the owner instead of admin??
        // maybe require admin to add employee and add cert
        // HR system as the owner to create cert to

        // for ownederts in employee, cert.transferownership
    }

}