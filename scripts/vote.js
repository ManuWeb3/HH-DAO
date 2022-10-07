// once a proposal is in place, voting happens
const fs = require("fs")
const { network, ethers } = require("hardhat")
const {developmentChains, proposalsFile, VOTING_PERIOD} = require("../helper-hardhat-config")
const { moveBlocks } = require("../utils/move-blocks")

const index = 0
// 'index' refers to the proposalId's array in proposals.json

// castVoteWithReason(proposalId, voteWay, reason)
async function main(proposalIndex) {
    // reading from proposals.json
    const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    // accessing 1st proposalId in the file
    const proposalId = proposals[network.config.chainId][proposalIndex]
    // voting rules: Against = 0, For = 1, Abstain = 2
    const voteWay = 1
    const reasonToVote = "Bas..., time pass lyi karti"
    await vote(proposalId, voteWay, reasonToVote)
}

async function vote(proposalId, voteWay, reasonToVote) {
    // Governor.sol's f(), inherited by our GovernorContract.sol
    const governor = await ethers.getContract("GovernorContract")
    // checking state
    const proposalState = await governor.state(proposalId)
    console.log(`Current State of the Proposal is: ${proposalState}`)  // Voting in progress
    // If state is 1 (Active), can cast my vote
    console.log("Casting my vote with the reason below:")
    const voteTxResponse = await governor.castVoteWithReason(proposalId, voteWay, reasonToVote) //B#14, when voting started at # 13
    const voteTxResponseReceipt = await voteTxResponse.wait(1)
    // an event VoteCast() is emitted, details commented below...
    console.log(`Reason: ${voteTxResponseReceipt.events[0].args.reason}`)        // i/p 'reason' saved on-chain
    console.log("Vote casted!")
    console.log("------------")
    // As I'm the only one voting, have to move the blocks to proceed
    if(developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_PERIOD + 1)
    }
    console.log("Voting Period is over!")
    console.log("----------------------")
    // Re-checking state
    const proposalNewState = await governor.state(proposalId)
    console.log(`Current State of the Proposal is: ${proposalNewState}`)
    // 'Succeeded' number: 4
}

main(index)
.then(() => process.exit(0))
.catch((error) => {
    console.log(error)
    process.exit(1)
})

/*
     * @dev Emitted when a vote is cast without params.
     *
     * Note: `support` values should be seen as buckets. Their interpretation depends on the voting module used.
     * 
     * event VoteCast(address indexed voter, uint256 proposalId, uint8 support, uint256 weight, string reason);
 */
