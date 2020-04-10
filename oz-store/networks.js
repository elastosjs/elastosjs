const secrets = require('../secrets.json')
const HDWalletProvider = require('@truffle/hdwallet-provider')
// const PrivateKeyProvider = require('@truffle/hdwallet-provider')

const mnemonic = secrets.mnemonic2
// const mainnetPrivKey = secrets.mainnetPrivKey

module.exports = {
  networks: {
    development: {
      protocol: 'http',
      host: 'localhost',
      port: 8545,
      gas: '8000000',
      gasPrice: '1000000000',
      network_id: '*',
    },
    elaethtest: {
      provider: () => new HDWalletProvider(
        mnemonic, 'https://rpc.elaeth.io'
      ),
      network_id: 3,
      gas: '8000000',
      gasPrice: '1000000000'
    }/*,
    elamain: {
      provider: () => new PrivateKeyProvider(
        mainnetPrivKey, 'https://mainrpc.elaeth.io'
      ),
      network_id: 1,
      gasLimit: '8000000',
      gasPrice: '1000000000'
    }*/
  },
};
