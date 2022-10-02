// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract Timelock is TimelockController {
    // will pass 3 args as needed by TimelockController
    constructor (
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) 
    TimelockController(minDelay, proposers, executors) 
    {}
}






/*
This will OWN Box.sol

Whenever we queue a proposal, we need to wait for the vote to be "executed".
All who hold the gov. token has to pay 5 tokens, say,... 
and, if someone is not ok with this, s/he can move out. 

This demands some time break, hence, TimeLock.sol
Close to being a 'governance executor' other than the Governor itself.

Owns Box.sol so that GovernorContract.sol does Not push thru any proposal willy nilly
whereas the GovernorContract.sol is something thru which all voting ops. happens
*/
