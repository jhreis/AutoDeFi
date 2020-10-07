// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

// import "https://github.com/curvefi/curve-contract/blob/master/contracts/pool-templates/y/DepositTemplateY.vy";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.1.0/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import './FacadeInterface.sol';

contract CompoundFacade is Facade {
    IERC20 constant USDC = IERC20(0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b);
    
    // address constant COMP = 0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1;
    IERC20 constant cUSDC = IERC20(0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1);
    
    uint256 constant MAX_INT = 2**256 - 1;
    
    address public owner;
    
    constructor(address _owner) public {
        owner = _owner;
        USDC.approve(address(cUSDC), MAX_INT);
    }
    
    function deposit() external {
        uint256 fullBalance = USDC.balanceOf(address(this));
        
        bytes memory payload = abi.encodeWithSignature("mint(uint256)", fullBalance);
        (bool success,) = address(cUSDC).call(payload);
        require(success);
        emit Deposit(address(this), msg.sender);
    
    }
    
    function withdraw() external {
        require(msg.sender == owner);
        
        // Pull assets out of Compound
        uint256 fullBalance = cUSDC.balanceOf(address(this));
        bytes memory payload = abi.encodeWithSignature("redeem(uint256)", fullBalance);
        (bool success,) = address(cUSDC).call(payload);
        require(success);
        
        // Actual, direct transfer to user wallet
        uint256 allUSDC = USDC.balanceOf(address(this));
        USDC.transfer(owner, allUSDC);

        emit Withdraw(address(this));
        
        // TODO: Consider removing withdraw permissions
    }
    
}