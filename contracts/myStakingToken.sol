// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyStakingToken is ERC20 {

    constructor() ERC20("Fake Uniswap staking token", "FST") {
        _mint(msg.sender, 22 * 10 ** 18);
    }
}
