// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import '../ERC20/IERC20.sol';
import '../Facades/FacadeInterface.sol';

/// @title An `Integration` for deploying `Facades`
/// @author Joel Reis
/// @notice Defines an `Integration` for deploying `Facades`
/// @dev This class must be overwritten and the abstract functions implemented by the child
abstract contract Integration {
    /// An asset pair that has a 1:1 assocaition between an asset and DeFi minting token
    /// e.g. USDC:cUSDC
    struct Pair {
        ERC20 underlyingAsset;
        ERC20 mintingAsset;
    }
    
    /// @notice The owner of this contract
    /// @dev The owner of this contract, set from deployer and unchangable
    /// @return The address with the most authority on this contract
    address public owner;

    /// @notice All available asset pairs for this `Integration`
    /// @dev Each `Integration` has a unique set of asset pairs that are contained here
    /// @return A specific asset `Pair`
    Pair[] public availablePairs;
    
    /// @notice Checks to make sure only the contract owner (deployer) can call a specific function
    /// @dev The contract deployer has certain elevated permissions, which can be checked here.
    modifier isOwner() {
        require(msg.sender == owner, "Must be owner!");
        _;
    }

    /// @notice An event used to communicate that a new asset `Pair` was added
    /// @dev Logs when a new asset `Pair` is added to this specific `Integration`
    /// @param index The index of the newly added asset `Pair`
    event LogAddedPair(uint index);
    
    /// @notice A simple constructor for deploying an `Integration`
    /// @dev Only handles setting up the owner from the deploying address
    constructor() {
        owner = msg.sender;
    }
    
    /// @notice Adds a new asset `Pair`
    /// @dev Accepts two address, that are used to construct an asset pair and stored as an option on this `Integration`
    /// @param underlyingAssetAddress The address for the underlying asset to be used (e.g. `USDC`)
    /// @param mintingAssetAddress The address for the minting asset to be used (e.g. `cUSDC`)
    /// @return A new index for the associated `Pair` that was just added
    function addAvailablePair(address underlyingAssetAddress, address mintingAssetAddress) external isOwner returns(uint) {
        ERC20 underlyingAsset = ERC20(underlyingAssetAddress);
        ERC20 mintingAsset = ERC20(mintingAssetAddress);
        Pair memory newPair = Pair(underlyingAsset, mintingAsset);
        
        /// In the future could prevent duplicate pair additions, but not super necessary, since protected function (todo)
        
        availablePairs.push(newPair);
        uint newIndex = availablePairs.length - 1;
        emit LogAddedPair(newIndex);
        return newIndex;
    }
    
    // Abstract, children must implement this

    /// @notice Deploys a new `Facade`
    /// @dev Accepts information for deploying a new `Facade` (e.g. `CompoundFacade`)
    /// @param _owner The address that will be the owner on the new deployment
    /// @param pairIndex The index associated with a specific asset `Pair`
    /// @return A newly deployed `Facade` instance
    function deployUserInstance(address payable _owner, uint pairIndex) external virtual returns(Facade);

    /// @notice The description of an `Integration`
    /// @dev Should provide a human-readable string that gives a short description what this `Integration` is (e.g. `Compound Protocol`)
    /// @return A human-readable string that describes the `Integration` deployed
    function description() external virtual pure returns(string memory);
}