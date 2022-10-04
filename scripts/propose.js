// To propose that our Box.sol saves 77 as newValue, default = 0

const { ethers, network } = require("hardhat")
const { NEW_STORE_VALUE, FUNC, PROPOSAL_DESCRIPTION, developmentChains, VOTING_DELAY } = require("../helper-hardhat-config.js")    // within ""
const { moveBlocks } = require("..utils/move-Blocks.js")
// We're going to propose on our GovernorContract.sol to store someValue on Box.sol
// So, importing both's deployed instances
async function propose(args, functionToCall, proposalDescription) {
    // Part - 1...
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    // encoding the f() call in ethers.js
    const encodeFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
    console.log(`Encoded Function Data: ${encodeFunctionCall}`)
    // Part - 2...
    // Now, moving towards proposing...
    console.log(`Proposing: ${functionToCall} on Box.sol deployed at: ${box.address} with value: ${args} `)
    console.log(`Proposal description: \n ${proposalDescription}`)
    // calling IGovernor-propose()
    // passing 3 args as lists (arrays)
    const proposeTx = await governor.propose(
        [box.address],      // contract
        [0],                // 'value' in ETH to be sent, if any
        [encodeFunctionCall],
        proposalDescription
    )
    // we need to have the proposalId + 2 others from the event {IGovernor-ProposalCreated}...
    // emitted in propose()
    const proposalTxReceipt = await proposeTx.wait(1)
    const proposalId = proposalTxReceipt.events[0].args.proposalId
    // retrieve... 1. State, 2. Snapshot, 3. Deadline
    // all 3 f() are per IGovernor.sol
    const proposalState = await governor.state(proposalId)
    const proposalSnapshot = await governor.proposalSnapshot(proposalId)    // set up in propose() during proposal-creation
    const proposalDeadline = await governor.proposalDeadline(proposalId)    // set up in propose()
    console.log(`Proposal's state: ${proposalState}`)
    console.log(`Proposal's snapshot: ${proposalSnapshot}`)
    console.log(`Proposal's deadline: ${proposalDeadline}`)

    // Part - 3...
    // have to seed things up on local dev chain for blocks/time to pass and people to vote
    // Modularity: utils' scripts created to speed up
    if(developmentChains.includes(network.name)) {
        // VOTING_DELAY used for the 2nd time after deploying GovernorContract.sol
        await moveBlocks(VOTING_DELAY + 1)
    }
}

// custom function
propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
.then(()=> process.exit(0))
.catch((error) => {
    console.log(error)
    process.exit(1)
})

/* To save the proposalId:
let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
proposals[network.config.chainId!.toString()].push(proposalId.toString())
fs.writeFileSync(proposalsFile, JSON.stringify(proposals))
*/
