// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/// @title An interface that defines what a `Facade` implementation should be able to do
/// @author Joel Reis
/// @notice Use this interface to define a new `Facade` implementation for a new DeFi protocol
/// @dev This is an interface that defines the required functionality for a `Facade`. The `Facade` may contain complex
///      logic to interface with a specific DeFi protocol, but the interface should always be simple and uniform
interface Facade {
    /// @notice An event used to communicate that a "Deposit" was performed
    /// @dev Logs when a deposit has been performed for a given `Facade`
    /// @param facade The address of the `Facade` that had the action performed
    /// @param depositor The address of the custodian that performed, and paid for the deposit transaction
    event LogDeposit(address indexed facade, address indexed depositor);

    /// @notice An event used to communicate a "Withdrawal" was performed
    /// @dev Logs when a withdrawal has been performed for a given `Facade`
    /// @param facade The address of the `Facade` that had the action performed
    event LogWithdraw(address indexed facade);

    /// @notice This deposits assets into the underlying contract, from the current account
    /// e.g. Account -> Compound
    /// @dev Deposits the asset associated with the asset pair
    function depositToUnderlying() external;

    /// @notice Withdraws funds from underlying contract, to EOA
    /// e.g. Comound -> Account -> EOA
    /// @dev This should be a protected function to prevent abuse of withdrawing
    ///      Withdrawing should always deposit funds back to the `owner`
    function withdraw() external;

    /// @notice Destroys the facade and transfers all funds to user wallet
    /// @dev This should be a protected function to prevent abuse of withdrawing
    ///      Withdrawing should always deposit funds back to the `owner`
    function destroy() external;

    ////// Convenience functions that should forward to the underlying contract

    /// @notice The balance inside the account of the underlying token
    /// e.g. USDC, DAI
    /// @dev Should forward requests to the underlying token
    /// @return The amount of the underlying token that is available for deposit
    function underlyingBalance() external view returns (uint256);

    /// @notice The balance inside the account of the minting token
    /// @dev Should forward requests to the minting token
    /// e.g. cUSDC, cDAI
    /// @return The amount of the minted balance that is available for withdrawing
    function mintedBalance() external view returns (uint256);

    /// @notice The asset symbol for the underlying token
    /// e.g. USDC, DAI
    /// @dev Should forward requests to the underlying token
    /// @return The symbol for the underlying token that is available for deposit
    function underlyingAssetSymbol() external view returns (string memory);

    /// @notice The asset symbol for the minting token
    /// e.g. cUSDC, cDAI
    /// @dev Should forward requests to the minting token
    /// @return The symbol for the minted token that is available for withdrawing
    function mintedAssetSymbol() external view returns (string memory);
}
