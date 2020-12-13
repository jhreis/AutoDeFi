// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import './Integrations/Integration.sol';

/// @title An interface that helps generate Facades on top of DeFi protocols
/// @author Joel Reis
/// @notice Use this contract to create accounts that work directly with common DeFi protocols, like Compound
/// @dev This is a simple interface that abstracts most of the complexities of the underlying `Integrations` that handle actual deploymnets.
contract Generator {
    
    /// @notice The owner of this contract
    /// @dev The owner of this contract, set from deployer and unchangable
    /// @return The address with the most authority on this contract
    address public owner;
    
    /// @notice The available protocols that are available to create facades from
    /// @dev Provide the index desired, and this returns a specific `Integration`
    /// @return A specific `Integration`, given a provided index
    Integration[] public availableProtocols;
    
    /// TODO Improvement: Eventually make this an array
    /// @notice Provides a Facade, given a wallet address
    /// @dev This can be used to lookup any associated facade for an address. Currently mapping is 1:1
    /// @return A specific facacde for a given address
    mapping(address => Facade) public facades;
    
    /// @notice All user addresses that have facades
    /// @dev This is an array that contains all addresses that have ever deployed a facade, even if the facade has been destroyed
    /// @return An address that has deployed a facade
    address[] public facadeOwners;
    
    /// @notice Determines whether a specific facade can be created or not
    /// @dev This is a circuit-breaker, and is used to track which `Integrations` are currently enabled / disabled
    /// @return whehter an `Integration` is enabled. The indeces match  exactly with `availableProtocols`
    bool[] public facadeEnabled;
    
    /// @notice Checks to make sure only the contract owner (deployer) can call a specific function
    /// @dev The contract deployer has certain elevated permissions, which can be checked here.
    modifier isOwner() {
        require(msg.sender == owner, "Must be owner!");
        _;
    }

    /// @notice An event used to communicate that a new protocol `Integration` has been added to the `Generator`
    /// @dev Logs when a new `Integration` is available for use
    /// @param integrationAddress The address of the new `Integration`
    /// @param integrationIndex The index of the new `Integration`
    event LogNewProtocolAdded(address integrationAddress, uint integrationIndex);

    /// @notice An event used to communicate that a new `Facade` has been deployed
    /// @dev States an address has now deployed a few `Facade` and provide enough info to perform lookups
    /// @param creator The address that created a `Facade`
    /// @param integrationIndex The index of the `Integration` used in the deployment
    /// @param pairIndex The index of the asset pair used for the deployment
    event LogFacadeCreated(address indexed creator, uint integrationIndex, uint pairIndex);

    /// @notice An event used to communicate that a `Facade` has been destroyed from this `Generator` interface
    /// @dev Will fire an event when a `Facade` has been destroyed
    /// @param destroyer The address that destroyed the `Facade`
    event LogFacadeDestroyed(address indexed destroyer);
    
    /// @notice A simple constructor for deploying a `Generator`
    /// @dev Only handles setting up the owner from the deploying address
    constructor() {
        owner = msg.sender;
    }
    
    /// @notice The `owner` can add a new protocol to be used by the `Generator`
    /// @dev An `Integration` must be manually deployed, and then the address is provided here to provide a link. This then allows wallets to create facade's against this new `Integration`
    /// @param newIntegration The address of a deployed `Integration`
    /// @return The index associated with the new `Integration` address
    function addNewProtocol(address newIntegration) public isOwner() returns(uint) {
        Integration integration = Integration(newIntegration);
        // No real need to prevent duplicate protocols, as this is owner controlled, and no negatives.
        availableProtocols.push(integration);
        facadeEnabled.push(true);
        uint index = availableProtocols.length - 1;
        emit LogNewProtocolAdded(newIntegration, index);
        return index;
    }
    
    /// @notice The `owner` can add a new protocol to be used by the `Generator`
    /// @dev An `Integration` must be manually deployed, and then the address is provided here to provide a link. This then allows wallets to create facade's against this new `Integration`
    /// @param integrationIndex The index of a specific `Integration` to be deployed
    /// @param pairIndex The index of the asset pair, on a given `Integration`, that should be used for the deployed `Facade`
    /// @return The newly deployed `Facade` instance
    function generateNewFacade(uint integrationIndex, uint pairIndex) public returns(Facade) {
        require(facadeEnabled[integrationIndex], "This integration is currently disabled.");
        require(facades[msg.sender] == Facade(0), "Facade already created for this address.");
        Facade newFacade = availableProtocols[integrationIndex].deployUserInstance(msg.sender, pairIndex);
        facades[msg.sender] = newFacade;
        facadeOwners.push(msg.sender);
        emit LogFacadeCreated(msg.sender, integrationIndex, pairIndex);
        return newFacade;
    }

    /// @notice A function that attempts to destroy a `Facade`.
    /// @dev This is a public, unprotected function. However, the `Facade` implementation protects against unprotected deletion and will block any unauthorized deletions.
    function destroyFacade() public {
        // Can only delete your own facade
        facades[msg.sender].destroy();
        // Burning owner
        delete facades[msg.sender];
        LogFacadeDestroyed(msg.sender);

        // TODO: Currently leaving the owners array intact to preserve data.
        //  So if fetching owners in a consuming way, will want to sort out owners with no facades
        //  A future improvement here would be to create a struct for facades that also includes an array index.
        //   and then cleanup the array and move items around to clean up empty slots. However, this is certainly 
        //   not needed for a fully functioning solution
    }
    
    /// @notice Enables / Disables a specific facade deployment.
    /// @dev This only impacts the `Generators` control over deployments. 
    /// @param facadeIndex The index of a specific facade that should have their deployment flag modified
    /// @param enabled Whether or not the given facade should be deployable or not
    function setEnabled(uint facadeIndex, bool enabled) public isOwner() {
        facadeEnabled[facadeIndex] = enabled;
    }
    
    /// @notice The number of owners that have created `Facades`
    /// @dev Provides the number of owners, which can be used to then query for all deployed `Facades`
    /// @return The number of facade owners that exist
    function numberOfOwners() public view returns(uint) {
        return facadeOwners.length;
    }
}
