// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import './CompoundFacade.sol';
import './Integrator.sol';

contract Generator {
    // mapping(uint => string);
    
    /// The available protocols that are available to create facades for
    Integration[] public integrations;
    
    /// User Address => Facade Address, make type safe
    mapping(address => Facade[]) public facades;
    
    /// All user addresses that have facades
    // address[] public facadeOwners;

    event LogFacadeCreated(address indexed from, address indexed creator);
    event LogFacadeDestroyed(address indexed owner);
    
    function generateNewFacade(uint integrationIndex, uint pairIndex) public {
        Facade newFacade = integrations[integrationIndex].deploy(pairIndex);
        facades[msg.sender].push(newFacade);
    }

    // TODO: danger, protect
    function destroyFacade(uint facadeIndex) public {
        facades[msg.sender][facadeIndex].destroy();
        delete facades[msg.sender][facadeIndex];
    }
}
