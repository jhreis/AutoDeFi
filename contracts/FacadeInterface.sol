// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.7.0;

interface Facade {
    event Deposit(address indexed facade, address indexed depositor);
    event Withdraw(address indexed facade);

    function deposit() external;
    function withdraw() external;
}