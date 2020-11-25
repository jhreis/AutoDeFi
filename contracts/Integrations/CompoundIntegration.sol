// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import './Integration.sol';
// This import is integration specific
import '../Facades/CompoundFacade.sol';

contract CompoundIntegration is Integration {
    function deployUserInstance(address payable _owner, uint pairIndex) override public returns(Facade) {
        Pair memory pair = availablePairs[pairIndex];
        // address USDC = 0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b;
        // address cUSDC = 0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1;
        
        Facade userCustomFacade = new CompoundFacade(_owner, pair.underlyingAsset, pair.mintingAsset);
        return userCustomFacade;
    }

    function description() override external pure returns(string memory) {
        return "Compound Protocol";
    }
}