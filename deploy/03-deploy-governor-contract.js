const { network} = require("hardhat")
const { developmentChains, VOTING_DELAY, VOTING_PERIOD, QUORUM_FRACTION} = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({getNamedAccounts, deployments}) {     // get auto-pulled from hre, hence, all-time available
    // trying out with get("ContractName")
    const {deploy } = deployments                                
    const {deployer} = await getNamedAccounts()                         // deployer is the public address of accounts[0]
    
    // 5 args in the contructor
    // using get() instead of ethers.getContract() - same functionality
    const govToken = await ethers.getContract("GovernanceToken")    
    const timelock = await ethers.getContract("Timelock")
    
    // "addresses" of govToken and timelock are input
    const args = [govToken.address, timelock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_FRACTION]

    console.log("Deploying GovernorContract.sol...")                    //B#4
    const govContract = await deploy("GovernorContract", {                  
        from: deployer,
        args: args,                     
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log("GovernorContract.sol deployed!")
    console.log("------------------------------")

    // Verifying on Goerli testnet
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {        // process.env is accessible here in deploy script
    console.log(`Verifying on Goerli.Etherscan.......`)
    await verify(govContract.address, args)
    console.log("Verified!")
    console.log("---------")
    }
}

module.exports.tags = ["all", "governorcontract"]
