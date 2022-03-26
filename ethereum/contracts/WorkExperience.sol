// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract WorkExperience {
    struct Data {
        string organisation;
        string position;
        string description;
        uint256 startDate;
        uint256 endDate;
        bool end;
    }

    Data public data;

    constructor(
        string memory _organisation,
        string memory _position,
        string memory _description,
        uint256 _startDate
    ) {
        data.organisation = _organisation;
        data.position = _position;
        data.description = _description;
        data.startDate = _startDate;
    }

    function setEndStatus() public {
        data.end = true;
    }

    function setEndDate(uint256 _endDate) public {
        data.endDate = _endDate;
    }

}