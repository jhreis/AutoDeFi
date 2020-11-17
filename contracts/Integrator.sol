// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;


// Potentially don't need this file, since it basically just manages an array
contract Integrator {
    address public owner;
    Integration[] public availableProtocols;

    modifier isOwner() {
        require(msg.sender == owner, "Must be owner!");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function addNewProtocol(address newIntegration) public isOwner() {
        Integration integration = Integration(newIntegration);
        // TODO: Prevent duplicate protocols
        availableProtocols.push(integration);
    }
}

import './CompoundFacade.sol';
import './FacadeInterface.sol';
import './IERC20.sol';

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
    
    function addPair(address underlyingAssetAddress, address mintingAssetAddress) external isOwner {
        ERC20 underlyingAsset = ERC20(underlyingAssetAddress);
        ERC20 mintingAsset = ERC20(mintingAssetAddress);
        Pair memory newPair = Pair(underlyingAsset, mintingAsset);
        
        // TODO: Prevente duplicate pair additions
        
        availablePairs.push(newPair);
    }
    
    // Abstract, children must implement this
    function deploy(uint pairIndex) external virtual returns(Facade);
}

contract CompoundIntegration is Integration {
    function deploy(uint pairIndex) override public returns(Facade) {
        Pair memory pair = availablePairs[pairIndex];
        // address USDC = 0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b;
        // address cUSDC = 0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1;
        
        // TODO: Deploy new compound instance
        Facade userCustomFacade = new CompoundFacade(msg.sender, pair.underlyingAsset, pair.mintingAsset);
        return userCustomFacade;
    }
}

contract CurveIntegration {
    
}