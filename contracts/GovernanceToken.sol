//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20Votes {

    uint256 private s_maxSupply = 1000000000000000000000000;        // 1M ETH = 1,000,000 * 1e18 wei

    constructor () 
    ERC20("GovernanceToken", "GT")
    ERC20Permit("GovernanceToken") {
        _mint(msg.sender, s_maxSupply);
    }

}