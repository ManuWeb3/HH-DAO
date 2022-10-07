// to move time, required to cover minDelay (=3600 s) in queue-and-execute.js

const { network } = require("hardhat")

async function moveTime(amount) {
    console.log("Moving Time...")
    await network.provider.send("evm_increaseTime", [amount])
    // same as Raffle.sol
    // looped thru evm_mine for multiple blocks, but no such loop here
    console.log(`Moved Time forward by ${amount} seconds`)
    console.log("----------------------------------")
}

module.exports = { moveTime }