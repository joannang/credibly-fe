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

    Details public details;

    constructor(
        string memory _organisation,
        string memory _position,
        string memory _description,
        uint256 _startDate
    ) {
        details.organisation = _organisation;
        details.position = _position;
        details.description = _description;
        details.startDate = _startDate;
    }

    function setEndStatus() public {
        details.end = true;
    }

    function setEndDate(uint256 _endDate) public {
        details.endDate = _endDate;
    }

}