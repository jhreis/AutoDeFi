// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "./Integration.sol";
// This import is integration specific
import "../Facades/CompoundFacade.sol";

/// @title A `CompoundIntegration` for deploying `CompoundFacades`
/// @author Joel Reis
/// @notice Helps deploy `CompoundFacades`
/// @dev Provides the implementation details for deploying any number of `Facades` associated with the Compound protocol
contract CompoundIntegration is Integration {
    /// Deploys a Compound Facade
    /// @inheritdoc Integration
    function deployUserInstance(address payable _owner, uint256 pairIndex)
        public
        override
        returns (Facade)
    {
        Pair memory pair = availablePairs[pairIndex];
        // address USDC = 0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b;
        // address cUSDC = 0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1;

        Facade userCustomFacade = new CompoundFacade(
            _owner,
            address(pair.underlyingAsset),
            address(pair.mintingAsset)
        );
        return userCustomFacade;
    }

    /// Describes this Compound Integration
    /// @inheritdoc Integration
    function description() external override pure returns (string memory) {
        return "Compound Protocol";
    }
}
