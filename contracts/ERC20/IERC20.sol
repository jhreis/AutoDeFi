// SPDX-License-Identifier: MIT
// https://eips.ethereum.org/EIPS/eip-20

pragma solidity ^0.7.0;

/// @title An interface that defines the ERC20 spec
/// @author Joel Reis
/// @notice Use this interface to define a new ERC20 asset
/// @dev Interface of the ERC20 standard as defined in the EIP.
interface IERC20 {
    /// @notice provides the amount of tokens a specific address has
    /// @dev necessary to know how many specific tokens an ETH address has
    /// @param _owner The address from which the balance will be retrieved
    /// @return balance the balance
    function balanceOf(address _owner) external view returns (uint256 balance);

    /// @notice send `_value` token to `_to` from `msg.sender`
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return success Whether the transfer was successful or not
    function transfer(address _to, uint256 _value)
        external
        returns (bool success);

    /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return success Whether the transfer was successful or not
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) external returns (bool success);

    /// @notice `msg.sender` approves `_addr` to spend `_value` tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @param _value The amount of wei to be approved for transfer
    /// @return success Whether the approval was successful or not
    function approve(address _spender, uint256 _value)
        external
        returns (bool success);

    /// @param _owner The address of the account owning tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @return remaining Amount of remaining tokens allowed to spent
    function allowance(address _owner, address _spender)
        external
        view
        returns (uint256 remaining);

    /// @notice An event used to communicate that an ERC20 asset transfer has happened
    /// @dev Emitted when `value` tokens are moved from one account (`from`) to another (`to`).
    ///      The `value` may be zero.
    /// @param from The address sending the token[s]
    /// @param to The address receiving the token[s]
    /// @param value The amount of token[s] being transferred
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     *
     */

    /// @notice An event used to communicate that an ERC20 asset transfer has happened
    /// @dev Emitted when the allowance of a `spender` for an `owner` is set by a call to {approve}.
    /// @param owner The address that currently holds the tokens
    /// @param spender The address that can now spend `value` of `owner` tokens
    /// @param value The new allowance
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

/// @title An interface that defines the enhanced ERC20 spec
/// @author Joel Reis
/// @notice Use this interface to define a new ERC20 asset including a few additional properties
/// @dev Interface of the ERC20 standard as defined in the EIP, in addition to the most common
///      enhanced properties. These are implemented by almost all ERC20 tokens, and required for
///      `AutoDeFi` to work correctly. All ERC20 tokens used in this protocol, must conform to
///      this interface, and not the simplistic IERC20
interface ERC20 is IERC20 {
    /// @notice Provides the name of the associated token
    /// @dev The name for the given token
    /// @return memory The name of the ERC20 token
    function name() external view returns (string memory);

    /// @notice Provides the symbol of the associated token
    /// @dev Then symbol for the given token (e.g. `USDC`)
    /// @return memory The of the ERC20 symbol
    function symbol() external view returns (string memory);
}
