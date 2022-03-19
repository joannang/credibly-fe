// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Organisation.sol';
import './Awardee.sol';

contract System {
    // uen => Organisation Obj
    mapping (string => Organisation) public organisations;
    // email => uen[] (list of organisations worked at)
    mapping (string => string[]) public employeeOrganisations;
    // email => Awardee Obj
    mapping (string => Awardee) public awardees;

    constructor() {
    }

    function registerOrganisation(
        string memory name,
        string memory uen,
        address admin
    ) public {
        Organisation organisation = new Organisation(name, uen, admin);
        organisations[uen] = organisation;
    }

    function registerEmployee(
        string memory uen,
        string memory name,
        string memory email,
        string position,
        uint256 startDate
    ) public {
        Organisation organisation = organisations[uen];
        organisation.addEmployee(email, name, position, startDate);
        employeeOrganisations[email].push(uen);
    }

    function registerAwardee(
        string memory email,
        address walletAddress
    ) public {
        // create new awardee obj
        awardees[email] = new Awardee(email, walletAddress);
        // transfer all certificates to awardee
        uint256 numEmployeeOrganisations = employeeOrganisations[email].length;
        for (uint256 i = 0; i < numEmployeeOrganisations; i++) {
            string memory uen = employeeOrganisations[i];
            Organisation organisation = organisations[uen];
            organisation.transferAllCertificates
        }

        

    }


}
