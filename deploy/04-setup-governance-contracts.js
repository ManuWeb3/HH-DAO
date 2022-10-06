const { ethers } = require("hardhat")
const { developmentChains, ADDRESS_ZERO } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({getNamedAccounts, deployments}) {     // get auto-pulled from hre, hence, all-time available
    // trying out with get("ContractName")
    const {deploy, log, get} = deployments                                
    const {deployer} = await getNamedAccounts()                         // deployer is the public address of accounts[0]
    
    // 5 args in the contructor
    // using get() instead of ethers.getContract() - same functionality
    const governorContract = await ethers.getContract("GovernorContract")    
    const timelock = await ethers.getContract("Timelock")

    // Now, setting up all the roles:
    console.log("Setting up the roles...")
    // Get the roles from TimelockController.sol...
    // and no one should be the Timelock Admin (no centralized roles)
    const proposerRole = await timelock.PROPOSER_ROLE()
    const cancellerRole = await timelock.CANCELLER_ROLE()
    const executorRole = await timelock.EXECUTOR_ROLE()
    const adminRole = await timelock.TIMELOCK_ADMIN_ROLE()
    
    // 3 grants + 1 revoke: to make roles DEcentralized
    // timelock does have these 2 f(): grant() and revoke() inheried...
    // but it's bcz deployer has these role-priviliges, that these f() get exec here
    // Voting process happens thru GovernorContract.sol: proposer and canceller roles
    const proposerTx = await timelock.grantRole(proposerRole, governorContract.address)     //B#5
    await proposerTx.wait(1)
    
    // usually, proposer has the canceller role as well
    const cancellerTx = await timelock.grantRole(cancellerRole, governorContract.address)   //B#6
    await cancellerTx.wait(1)

    const executorTx = await timelock.grantRole(executorRole, ADDRESS_ZERO)                 //B#7
    await executorTx.wait(1)

    // time to revoke admin role from deployer after other roles have been granted and decentralized
    const adminTx = await timelock.revokeRole(adminRole, deployer)                          //B#8
    await adminTx.wait(1)
    // Now, anything that timelock does goes thru Governance process/model...
    // no single entity / group owns Timelock.sol (TimelockController.sol)
    console.log("All 4 roles: TIMELOCK_ADMIN, PROPOSER, EXECUTOR, CANCELLER set up!")
    console.log("------------------------------------------------------------------")
}

// No verify() in this case
