// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

interface Facade {
    event Deposit(address indexed facade, address indexed depositor);
    event Withdraw(address indexed facade);

    /// This deposits assets into the underlying contract, from the current account
    /// e.g. Account -> Compound
    function depositToUnderlying() external;
    
    /// Withdraws funds from underlying contract, to EOA
    /// e.g. Comound -> Account -> EOA
    function withdraw() external;
    
    /// Destroys the facade and transfers all funds to user wallet
    function destroy() external;
    
    ////// Convenience functions that should forward to the underlying contract
    
    /// Returns the amount of the underlying token that is available for deposit
    /// e.g. USDC, DAI
    function underlyingBalance() external view returns(uint256);
    
    /// Returns the amount of the minted balance that is available for withdrawing
    /// e.g. cUSDC, cDAI
    function mintedBalance() external view returns(uint256);
    
    /// Returns the symbol for the underlying token that is available for deposit
    /// e.g. USDC, DAI
    function underlyingAssetSymbol() external view returns(string memory);
    
    /// Returns the symbol for the minted token that is available for withdrawing
    /// e.g. cUSDC, cDAI
    function mintedAssetSymbol() external view returns(string memory);
}