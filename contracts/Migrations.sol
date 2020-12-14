// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

contract Migrations {
    /// @notice The owner of this contract
    /// @dev The owner of this contract, set from deployer and unchangable
    /// @return The address with the most authority on this contract
    address public owner;

    /// @notice The last completed migration
    /// @dev Defines when the last migration was completed
    /// @return A value assocaited with the last completed migration
    uint public last_completed_migration;

    /// @notice A simple constructor for deploying a `Migrations`
    /// @dev Only handles setting up the owner from the deploying address
    constructor() {
        owner = msg.sender;
    }

    /// @notice Checks to make sure only the contract owner (deployer) can call a specific function
    /// @dev The contract deployer has certain elevated permissions, which can be checked here.
    modifier restricted() {
        if (msg.sender == owner) _;
    }

    /// @notice Defines whether a migration is completed, and if so, when it was finished
    /// @param completed Value of when this `Migrations` was completed
    /// @dev When the `Migrations` are completed, this is set to flag it is done
    function setCompleted(uint completed) public restricted {
        last_completed_migration = completed;
    }
}
