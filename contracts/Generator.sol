// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

import './CompoundFacade.sol';

contract Generator {
    /// User Address => Facade Address, make type safe
    mapping(address => address) public facadeInstances;
    
    /// All user addresses that have facades
    address[] public facadeOwners;

    event FacadeCreated(address indexed from, address indexed creator);
    
    function generateNewFacade() public {
        // TODO: Could allow multi-facade creation, why not?
        //      for now, make this restrictive
        
        // if (facadeInstances[msg.sender] != address(0)) {
            // "Destroy" old one
            // Facade(facadeInstances[msg.sender])
            
            // TODO: Main way to accomplish this would be to add a specialized function that `owner` or `self` could call that
            //  just returns funds to `owner` (still secure, just for pulls assets out)
        // }
        
        // assert(facadeInstances[msg.sender] == address(0));
        
        
        Facade userCustomFacade = new CompoundFacade(msg.sender);
        
        // TODO: Currently overwrite, look at previous todo's for potential fixes
        facadeInstances[msg.sender] = address(userCustomFacade);
        facadeOwners.push(msg.sender);

        emit FacadeCreated(address(this), msg.sender);
        
        // facadeInstances[msg.sender] = 
    }

    function destroyFacade() public {
        // TODO: This drastically needs to be improved
        facadeInstances[msg.sender] = address(0);
    }
    
}

        // EIP20 newToken = (new EIP20(_initialAmount, _name, _decimals, _symbol));
        // created[msg.sender].push(address(newToken));
        // isEIP20[address(newToken)] = true;
        // //the factory will own the created tokens. You must transfer them.
        // newToken.transfer(msg.sender, _initialAmount);
        // return address(newToken);