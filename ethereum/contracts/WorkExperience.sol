// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract WorkExperience {

    string organisation;
    string position;
    string description;
    uint256 startDate;
    uint256 endDate;
    bool end;

    constructor(
        string memory _organisation,
        string memory _position,
        string memory _description,
        uint256 _startDate
    ) {
        organisation = _organisation;
        position = _position;
        description = _description;
        startDate = _startDate;
    }

    function getWorkExperience() view public returns (
        string memory,
        string memory,
        string memory,
        uint256,
        uint256,
        bool
    ) {
        return (organisation, position, description, startDate, endDate, end);
    }

    function setEndStatus() public {
        end = true;
    }

    function setEndDate(uint256 _endDate) public {
        endDate = _endDate;
    }

}