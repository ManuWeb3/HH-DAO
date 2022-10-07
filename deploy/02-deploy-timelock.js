const { network } = require("hardhat");
const { developmentChains, MIN_DELAY } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify-timelock");

module.exports = async function ({getNamedAccounts, deployments}) {     // get auto-pulled from hre, hence, all-time available
    const {deploy, log} = deployments                                
    const {deployer} = await getNamedAccounts()                         // deployer is the public address of accounts[0]
    const args = [MIN_DELAY, [], []]

    console.log("Deploying Timelock.sol...")                            // B#3
    const timelock = await deploy("Timelock", {                  
        from: deployer,
        args: args,                      // kept args. - 'proposers' and 'executors' blank for now                            
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log("Timelock.sol deployed!")
    console.log("----------------------")

    // Verifying on Goerli testnet
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {        // process.env is accessible here in deploy script
    console.log(`Verifying on Goerli.Etherscan.......`)
    await verify(timelock.address, args)
    console.log("Verified!")
    console.log("---------")
    }
}

module.exports.tags = ["all", "timelock"]
