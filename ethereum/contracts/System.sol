// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Organisation.sol';
import './Awardee.sol';

contract System {
    // uen => Organisation Obj
    mapping (string => Organisation) public organisations;
    // email => uen[] (list of organisations worked at)
    mapping (string => string[]) public awardeesOrganisations;
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

    // register awardee
    function registerAwardee(
        string memory email
    ) public returns (address) {
        if (address(awardees[email]) != address(0)) {
            Awardee awardee = new Awardee(email);
            awardees[email] = awardee;
        }
        return awardees[email];
    }

    // add awardee to organisation
    function addAwardeeToOrganisation(
        string memory uen,
        string memory email
    ) public {
        // (require) organisation to be created alr
        // create awardee if awardee have not been created
        Awardee awardee = registerAwardee(email);
        Organisation organisation = organisations[uen];
        organisation.addAwardee(email, address(awardee));
        awardeesOrganisations[email].push(uen);
    }

    function linkAwardee(
        string email
    ) public {
        Awardee awardee = registerAwardee(email);
        awardee.setWalletAddress(msg.sender);

        // find all organisations awardee belong to, transfer NFT ownership
        string[] memory awardeeOrganisations = awardeeOrganisations[email];
        uint256 numOrganisations = awardeeOrganisations[email].length;
        for (uint256 i = 0; i < numOrganisations; i++) {
            string memory uen = awardeeOrganisations[i];
            Organisation organisation = organisations[uen];
            organisation.transferAllCertificates(email);
        }
    }

    // get all employee certs via email // in awardee contract

    function getOrganisation(string memory uen) public returns (Organisation) {
        return organisations[uen];
    }

    function getAwardee(string memory email) public returns (Awardee) {
        return awardees[email];
    }

}
