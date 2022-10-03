// const { ethers } = require("hardhat")

const MIN_DELAY = 3600  // 1 hour = 3,600 s
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
}