// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Organisation.sol';
import './Awardee.sol';

contract System {
    // uen => Organisation Obj
    mapping (string => Organisation) public organisations;
    // email => Awardee Obj
    mapping (string => Awardee) public awardees;

    constructor() {}

    // register organisation
    function registerOrganisation(
        string memory name,
        string memory uen,
        address admin
    ) public {
        require(address(organisations[uen]) == address(0), "Organisation already exists in system.");
        Organisation organisation = new Organisation(name, uen, admin);
        organisations[uen] = organisation;
    }

    // register awardee
    function registerAwardee(
        string memory email,
        string memory name
    ) public returns (Awardee) {
        if (address(awardees[email]) == address(0)) {
            Awardee awardee = new Awardee(email, name);
            awardees[email] = awardee;
        }
        return awardees[email];
    }

    // add awardee to organisation
    function addAwardeeToOrganisation(
        string memory uen,
        string memory email,
        string memory name
    ) public {
        require(address(organisations[uen]) != address(0), "Organisation does not exist system, please register organisation first.");
        Awardee awardee = registerAwardee(email, name);
        Organisation organisation = organisations[uen];
        organisation.addAwardee(email, address(awardee));
    }

    function linkAwardee(
        string memory email,
        string memory name
    ) public {
        Awardee awardee = registerAwardee(email, name);
        awardee.setWalletAddress(msg.sender);
    }

    // function getOrganisation(string memory uen) public view returns (Organisation) {
    //     return organisations[uen];
    // }

    // function getAwardee(string memory email) public view returns (Awardee) {
    //     return awardees[email];
    // }

}
