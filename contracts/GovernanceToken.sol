//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

// ERC20Votes has the capabilities of snapshots via checkpoints and delegation
// these enable fair voting
contract GovernanceToken is ERC20Votes {

    uint256 private s_maxSupply = 1000000000000000000000000;        // 1M ETH = 1,000,000 * 1e18 wei

    constructor () 
    ERC20("GovernanceToken", "GT")
    ERC20Permit("GovernanceToken") {
        _mint(msg.sender, s_maxSupply);
    }

    /*
     3 f() are overridden here as required by Solidity: 
     call return super.f() for getters and super.f() for setters
     1). _afterTokenTransfer()
     2). _mint()
     3). _burn()
     
     All 3 f() have _writeCheckpoints() capability enabled, thanks to ERC20Votes.sol...
     hence, all 3 will be writing checkpoints / saving snapshots of blockchain state...
     giving us the exact # of tokens / votes at specific checkpoints
    */
    function _afterTokenTransfer(address from, address to, uint256 amount) 
    internal override(ERC20Votes) {
        super._afterTokenTransfer(from, to, amount); 
    }

    function _mint(address to, uint256 amount) 
    internal override (ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount)
    internal override (ERC20Votes) {
        super._burn(account, amount);
    }
    
}