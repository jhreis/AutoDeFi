// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import './Integrations/Integration.sol';

contract Generator {
    
    /// The owner of this contract
    address public owner;
    
    /// The available protocols that are available to create facades from
    Integration[] public availableProtocols;
    
    /// TODO: Eventually make this an array
    /// User Address => Facade Address, make type safe
    mapping(address => Facade) public facades;
    
    /// All user addresses that have facades
    address[] public facadeOwners;
    
    modifier isOwner() {
        require(msg.sender == owner, "Must be owner!");
        _;
    }

    event LogFacadeCreated(address indexed from, address indexed creator);
    event LogFacadeDestroyed(address indexed owner);
    
    constructor() {
        owner = msg.sender;
    }
    
    function addNewProtocol(address newIntegration) public isOwner() returns(uint) {
        Integration integration = Integration(newIntegration);
        // TODO: Prevent duplicate protocols
        availableProtocols.push(integration);
        return availableProtocols.length - 1;
    }
    
    function generateNewFacade(uint integrationIndex, uint pairIndex) public returns(Facade) {
        require(facades[msg.sender] == Facade(0), "Facade already created for this address.");
        Facade newFacade = availableProtocols[integrationIndex].deployUserInstance(msg.sender, pairIndex);
        facades[msg.sender] = newFacade;
        return newFacade;
    }

    function destroyFacade() public {
        // Can only delete your own facade
        facades[msg.sender].destroy();
        delete facades[msg.sender];
    }
    
    function foo() public view returns(bool) {
        return address(facades[msg.sender]) == address(0);
    }
}
