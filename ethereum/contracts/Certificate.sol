// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract Certificate is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIdTracker;

    string public certificateId;
    string public description;
    string public organisation;

    address admin;


    constructor(string memory name, string memory _certificateId, string memory _description, string memory _organisation, address _admin) ERC721(name, 'Credibly') {
        certificateId = _certificateId;
        description = _description;
        organisation = _organisation;
        admin = _admin;
    }

    modifier onlyAdmin {
        require(tx.origin == admin, "Unauthorised user.");
        _;
    }

    function create(address owner, string memory ipfsHash) public onlyAdmin returns (uint256) {
        uint256 tokenId = tokenIdTracker.current();
        tokenIdTracker.increment();
        _mint(owner, tokenId);
        _setTokenURI(tokenId, ipfsHash);
        return tokenId;
    }

    function getData(uint256 tokenId) view public returns(string memory, string memory, string memory) {
        return (tokenURI(tokenId), description, organisation);
    }

    // overriding functions

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}