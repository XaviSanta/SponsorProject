const HDWalletProvider = require('@truffle/hdwallet-provider')

const mnemonic = "soldier unfold comic ...";
const url = "https://kovan.infura.io/v3/...";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    kovan: {
      provider: () => {
        return new HDWalletProvider(mnemonic, url)
        // return new HDWalletProvider(process.env.MNEMONIC, process.env.PUBLIC_URL)
      },
      network_id: '42'
    }
  },
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "petersburg",
      version: "0.6.6"
    }
  }
};
