// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Organisation.sol';
import './Awardee.sol';

contract System {

    // Which Organisation contract instance belongs to the UEN?
    // UEN (Unique Entity Number) is a unique identfier for each company
    // uen => Organisation instance
    mapping (string => Organisation) public organisations;

    // Which Awardee contract instance belongs to the email address?
    // email => Awardee instance
    mapping (string => Awardee) public awardees;

    // Which Organisation is the Awardee registered under?
    // email => list of Organisation instance
    mapping (string => Organisation[]) public awardeesOrganisations;

    constructor() {}

    // Register Organisation
    // Creates a new Organisation contract instance for the organisation
    function registerOrganisation(
        string memory name,
        string memory uen,
        address admin // admin of the organisation
    ) public {
        require(address(organisations[uen]) == address(0), "Organisation already exists in system."); // requires a unique uen for each organisation
        Organisation organisation = new Organisation(name, uen, admin);
        organisations[uen] = organisation;
    }

    // Register Awardee
    // Creates a new Awardee contract instance
    // Returns Awardee contract instance
    function registerAwardee(
        string memory email,
        string memory name
    ) public returns (Awardee) {
        if (address(awardees[email]) == address(0)) { // if Awardee instance does not exist, create a new Awardee instance
            Awardee awardee = new Awardee(email, name);
            awardees[email] = awardee;
        }
        return awardees[email];
    }

    // Add Awardee to Organisation
    function addAwardeeToOrganisation(
        string memory uen,
        string memory email,
        string memory name
    ) public {
        require(address(organisations[uen]) != address(0), "Organisation does not exist system, please register organisation first."); // require Organisations instance to exist
        Awardee awardee = registerAwardee(email, name); // creates a new Awardee instance for awardee if it does not exist yet and returns Awardee instance
        Organisation organisation = organisations[uen];
        organisation.addAwardee(email, address(awardee)); // adds Awardee instance to organisation instance
        awardeesOrganisations[email].push(organisation);
    }

    // Add Multiple Awardees to ONE Organisation
    // Calls addAwardeeToOrganisation() method repeatedly
    function addAwardeesToOrganisation(
        string memory uen,
        string[] memory emails,
        string[] memory names
    ) public {
        require(emails.length == names.length, "Invalid data."); // requires all arrays to be of equal length
        for (uint i = 0; i < emails.length; i++) {
            addAwardeeToOrganisation(uen, emails[i], names[i]);
        }
    }

    // Link Wallet Address to Awardee Contract Instance
    function linkAwardee(
        string memory email,
        string memory name
    ) public {
        Awardee awardee = registerAwardee(email, name); // creates a new Awardee instance for awardee if it does not exist yet and returns Awardee instance
        awardee.setWalletAddress(tx.origin); // set wallet address in Awardee instance
    }

    // Update Email of Awardee
    function changeEmail(
        string memory oldEmail,
        string memory newEmail
    ) public {
        require (address(awardees[oldEmail]) != address(0), "Awardee does not exist."); // requires Awardee instance to exist
        // update email in Awardee instance
        awardees[oldEmail].updateEmail(newEmail); // reverts if tx.origin is not owner of Awardee contract
        awardees[newEmail] = awardees[oldEmail];
        delete awardees[oldEmail]; // delete old email mapping
        // update email in Organisations that Awardees are registered to
        awardeesOrganisations[newEmail] = awardeesOrganisations[oldEmail];
        Organisation[] memory lOrganisations = awardeesOrganisations[newEmail]; // loop through all Organisations which Awardee are registered to
        for (uint i = 0; i < lOrganisations.length; i++) {
            lOrganisations[i].updateEmail(oldEmail, newEmail); // update email in Organisation instance
        }
        delete awardeesOrganisations[oldEmail]; // delete old email mapping
    }
}
