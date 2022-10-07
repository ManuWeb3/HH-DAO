// const { ethers } = require("hardhat")

const MIN_DELAY     = 200          // 1 hour = 3,600 s - meant for Timelock.sol's constructor
const VOTING_DELAY  = 1             // 1 block- meant for GovernorContract.sol's constructor
const VOTING_PERIOD = 5             // 5 block- ------------do-----------------------------
const QUORUM_FRACTION = 4           // 4% when denominator is set to 100 -------do--------
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"   
// 20 bytes 0x0 address
const NEW_STORE_VALUE = 77
const FUNC = "store"
const PROPOSAL_DESCRIPTION = "Proposal # 1, setting Box's value to 77"
const proposalsFile = "proposals.json"

const networkConfig = {
    4: {
        name: "rinkeby",    // going to be deprectaed on Oct 05
    },
    31337: {
        name: "hardhat",        
    },
    5: {
        name: "goerli",        
    },
}

const developmentChains = ["hardhat", "localhost"]

// exporting all the consts required for different deploy / run scripts
module.exports = {
    networkConfig, 
    developmentChains,
    MIN_DELAY,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_FRACTION,
    ADDRESS_ZERO,
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    proposalsFile,
}

// syntax: module.exports = {}