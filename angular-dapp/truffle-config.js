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
      // TODO: Change it to the corresponding id
      network_id: '*'
    }
  }
};
