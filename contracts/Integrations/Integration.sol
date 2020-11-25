// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import '../ERC20/IERC20.sol';
import '../Facades/FacadeInterface.sol';

abstract contract Integration {
    struct Pair {
        ERC20 underlyingAsset;
        ERC20 mintingAsset;
    }
    
    address public owner;
    Pair[] public availablePairs;
    
    modifier isOwner() {
        require(msg.sender == owner, "Must be owner!");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function addAvailablePair(address underlyingAssetAddress, address mintingAssetAddress) external isOwner returns(uint) {
        ERC20 underlyingAsset = ERC20(underlyingAssetAddress);
        ERC20 mintingAsset = ERC20(mintingAssetAddress);
        Pair memory newPair = Pair(underlyingAsset, mintingAsset);
        
        // TODO: Prevent duplicate pair additions
        
        availablePairs.push(newPair);
        return availablePairs.length - 1;
    }
    
    // Abstract, children must implement this
    function deployUserInstance(address payable _owner, uint pairIndex) external virtual returns(Facade);
    function description() external virtual pure returns(string memory);
}