// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyRewardToken is ERC20 {

    constructor() ERC20("My Reward token", "MRT") {
        _mint(msg.sender, 250 * 10 ** 18);
    }
}
