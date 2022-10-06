// once voting is done, we queue it before, finally, getting it executed

const { ethers } = require("hardhat")
const { FUNC, NEW_STORE_VALUE, PROPOSAL_DESCRIPTION } = require("../helper-hardhat-config")

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
    const queueTx = await governor.queue(
        
    )
}

queueAndExecute()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error)
    process.exit(1)
})