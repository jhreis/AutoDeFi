// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import '../ERC20/IERC20.sol';
import './FacadeInterface.sol';

contract CompoundFacade is Facade {
    uint256 constant MAX_INT = 2**256 - 1;
    
    /// The owner of the specific account instance
    address payable public owner;
    
    /// An address that is allowed to assist in certain functions to help with automation
    /// This address never has full control over funds
    /// e.g. sending funds back to `owner`'s wallet.
    address public assistant;
    
    /// The address of the underlying token
    /// e.g. USDC address
    ERC20 public underlyingAsset;
    
    /// The address of the token being minted
    /// e.g. cUSDC address
    ERC20 public mintingAsset;
    
    /// The amount required before a deposit will be approved
    uint256 public minimumUnderlyingForDeposit = 100;
    
    // Modifiers
    
    // Checks if caller is owner
    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
    
    // Checks to make sure the caller is friendly and is approved by owner to perform actions
    modifier isFriendly() {
        require(msg.sender == owner || msg.sender == assistant);
        _;
    }
    
    constructor(address payable _owner, ERC20 _underlyingAsset, ERC20 _mintingAsset) {
        owner = _owner;
        assistant = msg.sender;
        
        underlyingAsset = _underlyingAsset;
        mintingAsset = _mintingAsset;
        
        // This approves the contract (e.g. compound) to withdraw funds from the smart contract account
        underlyingAsset.approve(address(mintingAsset), MAX_INT);
    }
    
    /// This deposits funds into the underlying contract
    function depositToUnderlying() override external {
        uint256 fullBalance = underlyingAsset.balanceOf(address(this));
        
        // TODO: Enable reward!
        
        bytes memory payload = abi.encodeWithSignature("mint(uint256)", fullBalance);
        (bool success,) = address(mintingAsset).call(payload);
        require(success);
        emit Deposit(address(this), msg.sender);
    }
    
    function withdraw() override public isFriendly {
        // Pull assets out of Compound
        uint256 fullBalance = mintingAsset.balanceOf(address(this));
        bytes memory payload = abi.encodeWithSignature("redeem(uint256)", fullBalance);
        (bool success,) = address(mintingAsset).call(payload);
        require(success);
        
        // Actual, direct transfer to user wallet
        uint256 allUSDC = underlyingAsset.balanceOf(address(this));
        underlyingAsset.transfer(owner, allUSDC);

        emit Withdraw(address(this));
    }
    
    function destroy() override external isFriendly {
        // Secure all ERC20 funds
        withdraw();
        
        // Should be no ETH in contract
        selfdestruct(owner);
    }
    
    function setAssistant(address newAssistant) public isOwner {
        assistant = newAssistant;
    }

    ////// Convenience functions that forward to the underlying contract

    /// Returns the amount of the underlying token that is available for deposit
    /// e.g. USDC, DAI
    function underlyingBalance() override external view returns(uint256) {
      return underlyingAsset.balanceOf(address(this));
    }
    
    /// Returns the amount of the minted balance that is available for withdrawing
    /// e.g. cUSDC, cDAI
    function mintedBalance() override external view returns(uint256) {
      return mintingAsset.balanceOf(address(this));
    }
    
    /// Returns the symbol for the underlying token that is available for deposit
    /// This is available directly on the asset address, but providing a convenience function
    /// e.g. USDC, DAI
    function underlyingAssetSymbol() override external view returns(string memory) {
        return underlyingAsset.symbol();
    }
    
    /// Returns the symbol for the minted token that is available for withdrawing
    /// This is available directly on the asset address, but providing a convenience function
    /// e.g. cUSDC, cDAI
    function mintedAssetSymbol() override external view returns(string memory) {
        return mintingAsset.symbol();
    }
    
}