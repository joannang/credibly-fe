// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract Certificate is ERC721URIStorage, ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIDTracker;
    string certificateID;

    // constructor() ERC721('Credibly', 'Credibly') {
    // }
    constructor(string memory name, string memory symbol, string memory _certificateID) ERC721(name, symbol) {
        certificateID = _certificateID;
    }

    function create(address admin, string memory certificateUrl) public returns (uint256) {
        uint256 tokenID = tokenIDTracker.current();
        tokenIDTracker.increment();
        _mint(admin, tokenID);
        _setTokenURI(tokenID, certificateUrl);
        return tokenID;
    }

    function transferOwnership(address admin, address awardee, uint256 tokenID) public { 
        require( _isApprovedOrOwner(admin, tokenID), 'Caller is not owner of this certificate');
        _transfer(admin, awardee, tokenID);
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