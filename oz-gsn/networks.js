const { mnemonic, mainnetPrivKey } = require('./secrets.json')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const PrivateKeyProvider = require('@truffle/hdwallet-provider')

module.exports = {
  networks: {
    development: {
      protocol: 'http',
      host: 'localhost',
      port: 8545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: '*',
    },
    elaethtest: {
      provider: () => new HDWalletProvider(
        mnemonic, 'https://rpc.elaeth.io'
      ),
      networkId: 3,
      gasPrice: 10e9
    },
    elaethtestblack: {
      provider: () => new HDWalletProvider(
        mnemonic, 'https//183.197.227.129:20636'
      ),
      network_id: 3,
      gas_price: 10e9
    },
    elamain: {
      provider: () => new PrivateKeyProvider(
        mainnetPrivKey, 'https://mainrpc.elaeth.io'
      ),
      network_id: 1,
      gas_price: 10e9
    }
  },
};
