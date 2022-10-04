const { network } = require("hardhat");
const { developmentChains, MIN_DELAY } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({getNamedAccounts, deployments}) {     // get auto-pulled from hre, hence, all-time available
    const {deploy, log} = deployments                                
    const {deployer} = await getNamedAccounts()                         // deployer is the public address of accounts[0]
    
    console.log("Deploying Timelock.sol...")
    const govToken = await deploy("Timelock", {                  
        from: deployer,
        args: [MIN_DELAY, [], []],                      // kept args. - 'proposers' and 'executors' blank for now                            
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log("Timelock.sol deployed!")
    console.log("----------------------")

    // Verifying on Goerli testnet
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {        // process.env is accessible here in deploy script
    log(`Verifying on Goerli.Etherscan.......`)
    await verify(govToken.address, args)
    console.log("Verified!")
    console.log("---------")
    }
}

module.exports.tags = ["all", "timelock"]
