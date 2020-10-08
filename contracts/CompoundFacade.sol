// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

// import "https://github.com/curvefi/curve-contract/blob/master/contracts/pool-templates/y/DepositTemplateY.vy";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.1.0/contracts/token/ERC20/IERC20.sol";

// Ugh, for some reason this isn't a full ERC20 spec and only follows the IERC20 interface
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import './FacadeInterface.sol';

contract CompoundFacade is Facade {
    // TODO: These should be done via composition / dep injection
    ERC20 constant USDC = ERC20(0x4DBCdF9B62e891a7cec5A2568C3F4FAF9E8Abe2b);
    
    // address constant COMP = 0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1;
    ERC20 constant cUSDC = ERC20(0x5B281A6DdA0B271e91ae35DE655Ad301C976edb1);
    
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

    /// Returns the amount of the underlying token that is available for deposit
    /// e.g. USDC, DAI
    function underlyingBalance() external view returns(uint256) {
      return USDC.balanceOf(address(this));
    }
    
    /// Returns the amount of the minted balance that is available for withdrawing
    /// e.g. cUSDC, cDAI
    function mintedBalance() external view returns(uint256) {
      return cUSDC.balanceOf(address(this));
    }
    
    /// Returns the symbol for the underlying token that is available for deposit
    /// e.g. USDC, DAI
    function underlyingAssetSymbol() external view returns(string memory) {
      return "USDC";
    }
    
    /// Returns the symbol for the minted token that is available for withdrawing
    /// e.g. cUSDC, cDAI
    function mintedAssetSymbol() external view returns(string memory) {
      return "cUSDC";
    }
    
}