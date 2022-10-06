// To propose that our Box.sol saves 77 as newValue, default = 0

const { ethers, network } = require("hardhat")
const { NEW_STORE_VALUE, FUNC, PROPOSAL_DESCRIPTION, developmentChains, VOTING_DELAY, proposalsFile } = require("../helper-hardhat-config.js")    // within ""
const { moveBlocks } = require("../utils/move-blocks.js")
// We're going to propose on our GovernorContract.sol to store someValue on Box.sol
// So, importing both's deployed instances
const fs = require("fs")

async function propose(args, functionToCall, proposalDescription) {
    // Part - 1...
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    // encoding the f() call in ethers.js
    const encodeFunctionCall = box.interface.encodeFunctionData(functionToCall, args)
    console.log(`Encoded Function Data: ${encodeFunctionCall}`)
    // Part - 2...
    // Now, moving towards proposing...
    console.log(`Proposing: "${functionToCall}()" on Box.sol deployed at: ${box.address} with value: ${args} `)
    console.log(`Proposal description: \n${proposalDescription}`)
    // calling IGovernor-propose()
    // passing 3 args as lists (arrays)
    const proposeTx = await governor.propose(                       //B#11
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
    // all 3 getter-f() are per IGovernor.sol
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
    console.log("Voting Period begins...")

    // Part - 4:
    /* proposals.json' purpose:
    When proposalId gets created in propsoe(),...
    we'd want queue.js and vote.js scripts to read thru the Ids for further action
    + also enables MODULARITY: separate scripts for propose, queue, vote
    To save the proposalId:
    */
    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"))
    // JSON string constructed from i/p JS value/object to interact with it, below:
    proposals[network.config.chainId.toString()].push(proposalId.toString())
    // network-specific ("31337") proposals will be created and proposalIds will be pushed onto
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals))
    // converted JS value/object back to JSON string to write to the file
}

// custom function
propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
.then(()=> process.exit(0))
.catch((error) => {
    console.log(error)
    process.exit(1)
})
//=====================================================================

// Additional Notes:

// 'fs' module: does File input/Output operation

/* Node.js - fs.readFileSync(path [,options]): (and 'fs' is a module which has readFileSync as one of its API)
--fs.readFile(): reads the contents of the the file...
in a non-blocking Async mode...
whereas:
--fs.readFileSync():
 reads the file in Sync way, i.e. it blocks the other parallel running processes...,
 returns the content of file, and then resumes the blocked processes

 -- path: relative path / fileDescriptor
 -- options: encoding option. Default: null, our i/p: "utf8"
*/
// --------------------------------------------------------------------

/* JSON.parse(JSON string)- (reverse of JSON.stringify())
parses a JSON string, constructs a JS Value Or a JS Object that represents the JSOIN string i/p
e.g.:
const json = '{"result":true, "count":42}';
const obj = JSON.parse(json);

console.log(obj.count);
// expected output: 42

console.log(obj.result);
// expected output: true
*/
// --------------------------------------------------------------------

/* JSON.stringify(JS value/object)- (reverse of JSON.parse())
converts a JS value to a JSON string (hence, the name 'stringify')
e.g.---------------
console.log(`Transaction Receipt: ${JSON.stringify(txReceipt)}`)
*/
// --------------------------------------------------------------------

/* fs.writeFileSync(file, data, options):
writes to the file specified as argument.
If file does Not exists already, it creates the file

Params:
1. file: path / fileDescriptor
2. data: content to be written in the file
3. options:
    (a). encoding: default- "utf8"
    (b). mode
    (c). flag
*/