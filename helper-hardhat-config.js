// const { ethers } = require("hardhat")

const MIN_DELAY     = 3600          // 1 hour = 3,600 s - meant for Timelock.sol's constructor
const VOTING_DELAY  = 1             // 1 block- meant for GovernorContract.sol's constructor
const VOTING_PERIOD = 5             // 5 block- ------------do-----------------------------
const QUORUM_FRACTION = 4           // 4% when denominator is set to 100 -------do--------
const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"   
// 20 bytes 0x0 address

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

module.exports = {
    networkConfig, 
    developmentChains,
    MIN_DELAY,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_FRACTION,
    ADDRESS_ZERO,
}