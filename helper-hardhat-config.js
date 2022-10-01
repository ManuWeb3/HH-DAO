// const { ethers } = require("hardhat")

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
}