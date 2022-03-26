// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract WorkExperience {

    string public organisation;
    string public position;
    string public description;
    uint256 public startDate;
    uint256 public endDate;
    bool public end;

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