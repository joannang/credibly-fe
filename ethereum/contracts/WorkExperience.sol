// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract WorkExperience {

    struct Details {
        string organisation;
        string position;
        string description;
        uint256 startDate;
        uint256 endDate;
        bool end;
    }

    address public admin; // admin wallet address of the Organisation that created this Work Experience instance
    Details public details;

    constructor(
        string memory _organisation,
        string memory _position,
        string memory _description,
        uint256 _startDate,
        address _admin
    ) {
        details.organisation = _organisation;
        details.position = _position;
        details.description = _description;
        details.startDate = _startDate;
        admin = _admin;
    }

    modifier onlyAdmin { // only the admin wallet address can execute the function
        require(tx.origin == admin, "Unauthorised user.");
        _;
    }

    // Update End Date of Work Experience
    function setEndDate(uint256 _endDate) public onlyAdmin {
        details.endDate = _endDate;
    }

}