// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("JPYC Coin", "JPYC") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}