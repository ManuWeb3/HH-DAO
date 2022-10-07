const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({getNamedAccounts, deployments}) {     // get auto-pulled from hre, hence, all-time available
    const {deploy, log} = deployments                                
    const {deployer} = await getNamedAccounts()                         // deployer is the public address of accounts[0]
    const args = []

    console.log("Deploying GovernanceToken.sol...")                     // B#1
    const govToken = await deploy("GovernanceToken", {                  
        from: deployer,
        args: args,                                                                         
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log("GovernanceToken.sol deployed!")
    console.log("-----------------------------")

    // Verifying on Goerli testnet
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {        // process.env is accessible here in deploy script
    console.log(`Verifying on Goerli.Etherscan.......`)
    await verify(govToken.address, args)
    console.log("Verified!")
    console.log("---------")
    }

    // delegate()...to create a checkpoint for deployer
    // need to delegate votes to someone at the start
    // Hey, take my votes and use however you want
    console.log(`Delegating to ${deployer}`)
    await delegate(deployer)                                
    console.log("Delegated!")
    console.log("----------")
}
// outside module.exports
// JS syntax
async function delegate(delegatedAccount) {
    const govToken = await ethers.getContract("GovernanceToken")
    // deployer's voting power is transferred to deployer himself thru its "balanceOf"
    // got all-minted-supply when GovToken.sol was deployed (via _mint())

    // GovernanceToken.sol inherits ERC20Votes.sol, hence, invokes delegate()
    const TxDelegate = await govToken.delegate(delegatedAccount)        // B#2
    await TxDelegate.wait(1)
    // Also, checkpoints set when _moveVotingPower() invoked in delegate()
    // verify this by numCheckpoints(deployer)
    const numberOfCheckpoints = await govToken.numCheckpoints(delegatedAccount)
    console.log(`Number of Checkpoints for ${delegatedAccount} is: ${numberOfCheckpoints}`)
}

module.exports.tags = ["all", "govtoken"]
