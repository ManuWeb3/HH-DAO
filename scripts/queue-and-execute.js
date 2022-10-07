// once voting is done, we queue it before, finally, getting it executed

const { ethers, network } = require("hardhat")
const { FUNC, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION, MIN_DELAY, developmentChains } = require("../helper-hardhat-config")
const { moveTime } = require("../utils/move-time")
const { moveBlocks } = require("../utils/move-blocks")

async function queueAndExecute() {
    const args = [NEW_STORE_VALUE]                  // args: single-element array in this case
    const box = await ethers.getContract("Box")
    const encodeFunctionCall = box.interface.encodeFunctionData(FUNC, args)
    // details of encodeFunctionData() in propose.js script
    const descriptionHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
    )
    // got all args of queue()
    const governor = await ethers.getContract("GovernorContract")
    console.log("Queueing the succeeded proposal...")
    const queueTx = await governor.queue(           //B#21
        [box.address],
        [0],
        [encodeFunctionCall],
        descriptionHash
    )
    await queueTx.wait(1)
    console.log("Queued!")
    console.log("-------")

    if(developmentChains.includes(network.name)) {
        // have to move time here because minDelay = 3600 seconds
        await moveTime(MIN_DELAY + 1)           // +1 is there just to be safe
        // have to reduce MIN_DELAY from 1 hour to run it on testnet else it will fail
        
        // moveBlocks also, just to simulate reality
        await moveBlocks(1)                         //B#22, mined (moved) empty block
        // no Tx happened, hence no such details
    }

    // ==============================================

    console.log("Executing now...")
    const executeTx = await governor.execute(       //B#23
        [box.address],
        [0],
        [encodeFunctionCall],   // finally, executing() "store(77)" on Box.sol, after proposal, vote, and queue
        descriptionHash
    )
    await executeTx.wait(1)

    console.log("Executed!")
    console.log("---------")

    // retrieving newValue in Box.sol to check whether it got updated to 77
    const newValue = await box.retrieve()
    console.log(`New Value in Box.sol after executing the vote: ${newValue.toString()}`)
}

queueAndExecute()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error)
    process.exit(1)
})