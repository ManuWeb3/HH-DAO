// SPDX-License-Identifier: MIT

// Will have all the Voting-logic (proposing, exec., queueing)...
// that GovernanceToken.sol will use

pragma solidity ^0.8.4;

// 6 imported
import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

// 6 inherited
contract GovernorContract is 
Governor, GovernorSettings, GovernorCountingSimple, 
GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {
    constructor(
        IVotes _token, 
        TimelockController _timelock,
        uint256 _votingDelay,     // _votingDelay, _votingPeriod, and _quorumPercentage will be i/p at deploy
        uint256 _votingPeriod,
        uint256 _quorumPercentage
        )
        Governor("GovernorContract")
        GovernorSettings(_votingDelay, _votingPeriod, 0)    // proposedThreshold = 0, set in OZ Wizard
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(_quorumPercentage)
        GovernorTimelockControl(_timelock)
    {}
    
    // The following functions are overrides required by Solidity.
    // call return super.f() for getters and super.f() for setters

    function votingDelay()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingDelay();
    }

    function votingPeriod()
        public
        view
        override(IGovernor, GovernorSettings)
        returns (uint256)
    {
        return super.votingPeriod();
    }

    function quorum(uint256 blockNumber)
        public
        view
        override(IGovernor, GovernorVotesQuorumFraction)
        returns (uint256)
    {
        return super.quorum(blockNumber);
    }

    function state(uint256 proposalId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, string memory description)
        public
        override(Governor, IGovernor)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    // votes required with an account to become a Proposer from a Voter
    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    // the only Setter()
    function _execute(uint256 proposalId, address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
    {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(address[] memory targets, uint256[] memory values, bytes[] memory calldatas, bytes32 descriptionHash)
        internal
        override(Governor, GovernorTimelockControl)
        returns (uint256)
    {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(Governor, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
