// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import '../ERC20/IERC20.sol';
import './FacadeInterface.sol';

/// @title A compound.finance facade implementation
/// @author Joel Reis
/// @notice Interfaces directly with compound.finance
/// @dev This can be used as an example for generating other DeFi facade interfaces
contract CompoundFacade is Facade {
    // This is the max value for a uint256
    uint256 constant MAX_INT = 2**256 - 1;
    
    /// @notice The owner of this contract
    /// @dev The owner of this contract, set from deployer and unchangable
    /// @return The address with the most authority on this contract
    address payable public owner;
    
    /// @notice Returns an address that is allowed to assist in certain functions to help with automation
    ///         This address never has full control over funds
    ///         e.g. sending funds back to `owner`'s wallet.
    /// @dev Returns the pre-defined, unedited assistant
    /// @return Assistant hich is permissioned to call specific functions
    address public assistant;
    
    /// @notice Returns the underlying token
    ///         e.g. USDC address
    /// @dev Returns an ERC20 token that is used to deposit into Compound
    /// @return The underlying token used
    ERC20 public underlyingAsset;
    
    /// @notice Returns the address of the token being minted
    ///         e.g. cUSDC address
    /// @dev Returns an ERC20 token that is minted from Compound
    /// @return The token that a specific DeFi protocols mints
    ERC20 public mintingAsset;
    
    // Modifiers
    
    /// @notice Checks to make sure only the contract owner (deployer) can call a specific function
    /// @dev The contract deployer has certain elevated permissions, which can be checked here.
    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    
    /// @notice Checks to make sure the caller is friendly and is approved by owner to perform actions
    /// @dev Certain permissions require either the owner or assistant to perform them. This checks those roles.
    modifier isFriendly() {
        require(msg.sender == owner || msg.sender == assistant);
        _;
    }
    
    /// @notice Constructor for a new `CompoundFacade` deployment
    /// @dev Deploys a new `Facade` that interfaces directly against the Compound protocol
    /// @param _owner The address of who should own this contract
    /// @param _underlyingAsset The address of the underlying asset (e.g. `USDC`)
    /// @param _mintingAsset The address of the token that Compound will mint, based on the underlying token (e.g. `cUSDC`)
    constructor(address payable _owner, address _underlyingAsset, address _mintingAsset) {
        owner = _owner;
        assistant = msg.sender;
        
        underlyingAsset = ERC20(_underlyingAsset);
        mintingAsset = ERC20(_mintingAsset);
        
        // This approves the contract (e.g. compound) to withdraw funds from the smart contract account
        underlyingAsset.approve(address(mintingAsset), MAX_INT);
    }
    
    /// This deposits funds into the underlying contract
    /// @inheritdoc Facade
    function depositToUnderlying() override external {
        uint256 fullBalance = underlyingAsset.balanceOf(address(this));
        
        // TODO: Enable reward!
        
        bytes memory payload = abi.encodeWithSignature("mint(uint256)", fullBalance);
        (bool success,) = address(mintingAsset).call(payload);
        require(success);
        emit LogDeposit(address(this), msg.sender);
    }
    
    /// Withdraws all user funds, is protected
    /// @inheritdoc Facade
    function withdraw() override public isFriendly {
        // Pull assets out of Compound
        uint256 fullBalance = mintingAsset.balanceOf(address(this));
        bytes memory payload = abi.encodeWithSignature("redeem(uint256)", fullBalance);
        (bool success,) = address(mintingAsset).call(payload);
        require(success);
        
        // Actual, direct transfer to user wallet
        uint256 allUSDC = underlyingAsset.balanceOf(address(this));
        underlyingAsset.transfer(owner, allUSDC);

        emit LogWithdraw(address(this));
    }
    
    /// Destroys a given `Facade`, is protected
    /// @inheritdoc Facade
    function destroy() override external isFriendly {
        // Secure all ERC20 funds
        withdraw();
        
        // Should be no ETH in contract
        selfdestruct(owner);
    }

    ////// Convenience functions that forward to the underlying contract

    /// This is available directly on the asset address, but is added for convenience
    /// @inheritdoc Facade
    function underlyingBalance() override external view returns(uint256) {
      return underlyingAsset.balanceOf(address(this));
    }
    
    /// This is available directly on the asset address, but is added for convenience
    /// @inheritdoc Facade
    function mintedBalance() override external view returns(uint256) {
      return mintingAsset.balanceOf(address(this));
    }
    
    /// This is available directly on the asset address, but is added for convenience
    /// @inheritdoc Facade
    function underlyingAssetSymbol() override external view returns(string memory) {
        return underlyingAsset.symbol();
    }
    
    /// This is available directly on the asset address, but is added for convenience
    /// @inheritdoc Facade
    function mintedAssetSymbol() override external view returns(string memory) {
        return mintingAsset.symbol();
    }
    
}