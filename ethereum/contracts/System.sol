// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Organisation.sol';
import './Awardee.sol';

contract System {
    // uen => Organisation Obj
    mapping (string => Organisation) public organisations;
    // email => uen[] (list of organisations worked at)
    mapping (string => string[]) public employeesOrganisations;
    // email => Awardee Obj
    mapping (string => Awardee) public awardees;


    constructor() {
    }

    // register organisation
    function registerOrganisation(
        string memory name,
        string memory uen,
        address admin
    ) public {
        Organisation organisation = new Organisation(name, uen, admin);
        organisations[uen] = organisation;
    }

    // register employee to organisation
    function registerEmployee(
        string memory uen,
        // string memory name,
        string memory email
        // string memory position,
        // uint256 startDate
    ) public {
        Organisation organisation = organisations[uen];
        // organisation.addEmployee(email, name, position, startDate);
        employeesOrganisations[email].push(uen);
    }

    // register awardee
    // transfer all exisitng nfts to awardee
    // register awardee to organisation
    function registerAwardee(
        string memory email,
        address awardee
    ) public {
        // create new awardee obj
        awardees[email] = new Awardee(email, awardee);
        string[] memory employeeOrganisations = employeesOrganisations[email];
        // find all organisations awardee belong to
        uint256 numEmployeeOrganisations = employeesOrganisations[email].length;
        for (uint256 i = 0; i < numEmployeeOrganisations; i++) {
            string memory uen = employeeOrganisations[i];
            Organisation organisation = organisations[uen];
            // add awardees to organisation
            organisation.addAwardee(email, awardee);
            // transfer all certs
            organisation.transferAllCertificates(email, awardee);
        }
        // return organisation.employeesCertificates();
    }

    // get all employee certs via email // useless function?

    function getOrganisation(string memory uen) public returns (Organisation) {
        return organisations[uen];
    }

    function getAwardee(string memory email) public returns (Awardee) {
        return awardees[email];
    }

    // function newCertificate(
    //     string memory uen,
    //     string memory name,
    //     string memory certificateID
    // ) public {
    //     Organisation organisation = organisations[uen];
    //     organisation.addCertificate(name, certificateID);
    // }

    // function awardCertificate(
    //     string memory uen,
    //     string memory email,
    //     string memory certificateID,
    //     string memory url
    // ) public {
    //     Organisation organisation = organisations[uen];
    //     organisation.awardCertificate(email, certificateID, url);
    // }

    // function getCertificate(
    //     string memory email
    // )

    // test contract using system.sol only


}
