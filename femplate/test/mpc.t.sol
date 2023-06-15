// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "forge-std/Test.sol";

import {MPC} from "src/mpc.sol";

contract MPCtest is Test {
    using stdStorage for StdStorage;

    MPC mpc;

    uint256 owners;

    function setUp() external {
          owners = 4;

    }

    // VM Cheatcodes can be found in ./lib/forge-std/src/Vm.sol
    // Or at https://github.com/foundry-rs/forge-std
    function testSetOwner() external {
        assertEq(owners, 4);
    }
}
