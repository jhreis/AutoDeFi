// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import './IERC20.sol';

// This is a basic / standard ERC20 contract
// It is only deployed to local blockchains to provide the necessary asset
//  pairs to the Compound Facade.

/// @title A boilerplate ERC20 token implementation
/// @author Joel Reis
/// @notice A sample ERC20 token, solely used for testing
/// @dev `AutoDeFi` requires ERC20 tokens to function, instances of this are created
///      for local blockchains to properly display token information / balances.
contract StandardERC20 is ERC20 {
    // This is the max value for a uint256
    uint256 constant private MAX_UINT256 = 2**256 - 1;

    /// @notice The balances of all token holders
    /// @dev This tracks the balance of any adddress that has ever had tokens
    /// @return The balance of a specific address
    mapping (address => uint256) public balances;

    /// @notice The spend permission of all token holders
    /// @dev This tracks the spending permissions of any adddress that has ever had or given spending permissions
    /// @return The spend allowance of a specific address pair
    mapping (address => mapping (address => uint256)) public allowed;

    /// @notice The totoal amount of tokens
    /// @dev The current token supply. Can be modified
    /// @return The total amount of tokens currently available
    uint256 public totalSupply;

    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string override public name;          // Fancy name: eg USD Coin
    uint8 public decimals;                // How many decimals to show.
    string override public symbol;        // An identifier: eg USDC

    /// @notice Constructor for a new `ERC20` deployment
    /// @dev Deploys a new `ERC20` token
    /// @param _initialAmount The starting supply of tokens
    /// @param _tokenName The name that will be associated with this token
    /// @param _decimalUnits The amount of decimals that this token will use
    /// @param _tokenSymbol The symbol that will be associated with this token
    constructor(uint256 _initialAmount, string memory _tokenName, uint8 _decimalUnits, string  memory _tokenSymbol) {
        balances[msg.sender] = _initialAmount;               // Give the creator all initial tokens
        totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes
    }

    /// @notice send `_value` token to `_to` from `msg.sender`
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return success Whether the transfer was successful or not
    function transfer(address _to, uint256 _value) public override returns (bool success) {
        require(balances[msg.sender] >= _value, "token balance is lower than the value requested");
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        emit Transfer(msg.sender, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    /// @notice send `_value` token to `_to` from `_from` on the condition it is approved by `_from`
    /// @param _from The address of the sender
    /// @param _to The address of the recipient
    /// @param _value The amount of token to be transferred
    /// @return success Whether the transfer was successful or not
    function transferFrom(address _from, address _to, uint256 _value) public override returns (bool success) {
        uint256 _allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && _allowance >= _value, "token balance or allowance is lower than amount requested");
        balances[_to] += _value;
        balances[_from] -= _value;
        if (_allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }
        emit Transfer(_from, _to, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    /// @notice provides the amount of tokens a specific address has
    /// @dev necessary to know how many specific tokens an ETH address has
    /// @param _owner The address from which the balance will be retrieved
    /// @return balance the balance
    function balanceOf(address _owner) public override view returns (uint256 balance) {
        return balances[_owner];
    }

    /// @notice `msg.sender` approves `_addr` to spend `_value` tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @param _value The amount of wei to be approved for transfer
    /// @return success Whether the approval was successful or not
    function approve(address _spender, uint256 _value) public override returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value); //solhint-disable-line indent, no-unused-vars
        return true;
    }

    /// @param _owner The address of the account owning tokens
    /// @param _spender The address of the account able to transfer the tokens
    /// @return remaining Amount of remaining tokens allowed to spent
    function allowance(address _owner, address _spender) public override view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }
}