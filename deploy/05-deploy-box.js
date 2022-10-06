const { network, ethers } = require("hardhat");
const { developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({getNamedAccounts, deployments}) {     // get auto-pulled from hre, hence, all-time available
    const {deploy, log} = deployments                                
    const {deployer} = await getNamedAccounts()                         // deployer is the public address of accounts[0]
    
    console.log("Deploying Box.sol...")                                 //B#9
    const box = await deploy("Box", {                  
        from: deployer,
        args: [],                      
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    console.log("Box.sol deployed!")
    console.log("-----------------")

    console.log("Transferring Box.sol's ownership to Governance (Timelock)")
    // Box.sol is deployed by deployer, not Governance (model / process) = Timelock
    // hence, we'll give this privilege eventually to Timelock, below:

    // we need Box.sol's contract's instance, hence, getContractAt("", address)...
    // we do NOT need Box.sol's deployed-instance, hence, NOT getContract("")
    // post-deployment, of course
    const boxContract = await ethers.getContractAt("Box", box.address)
    const timelock = await ethers.getContract("Timelock")
    // getContract("") is fine to get its .address
    const boxContractTx = await boxContract.transferOwnership(timelock.address) //B#10
    await boxContractTx.wait(1)
    console.log("Ownership transferred!")
    console.log("----------------------")

    // Verifying on Goerli testnet
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {        // process.env is accessible here in deploy script
    log(`Verifying on Goerli.Etherscan.......`)
    await verify(box.address, args)
    console.log("Verified!")
    console.log("---------")
    }
}

module.exports.tags = ["all", "timelock"]
