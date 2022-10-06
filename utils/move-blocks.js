const { network } = require("hardhat");

async function moveBlocks (amount) {
    console.log("Moving blocks...")
    for (let index=0; index < amount; index++) {
        // syntax to invoke evm_mine
        // Raffle.sol: await network.provider.send("evm_mine", [])
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })        
    }
    console.log(`Moved ${amount} blocks`)
}

module.exports = {moveBlocks}