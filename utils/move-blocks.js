const { network } = require("hardhat");

async function moveBlocks (amount) {
    for (let index=0; index < amount; index++) {
        console.log("Moving blocks...")
        // syntax to invoke evm_mine
        // Raffle.sol: await network.provider.send("evm_mine", [])
        await network.provider.request({
            method: "evm_mine",
            params: [],
        })
    }
}

module.exports = {moveBlocks}