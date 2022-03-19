// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import './Certificate.sol';

contract Awardee {
    string public email;
    address public walletAddress;
    Certicate[] public certificates;
    address[] public accessRights;
    bool public privacy;

    function getCertificates() {
    }


}