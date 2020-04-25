#!/bin/sh

# Must be run from /client

# Smart Contract Address per network is stored in /client/src/config.js, but
# it's actually updated by /oz-store/deploy-*.sh scripts

# Right now the network is hardcoded in /client/src/context/NetworkContext
# const DEFAULT_NETWORK = constants.NETWORK.*

if [[ $# < 1 || ($1 != 'LOCAL' && $1 != 'TESTNET' && $1 != 'MAINNET')]]; then
  echo 'missing or wrong argument network name, one of LOCAL, TESTNET, MAINNET'
  exit 0
fi

sed -i '' -e "s!^\(const DEFAULT_NETWORK = constants.NETWORK.\).*!\1$1!" ./src/context/NetworkContext.js

echo "Network changed to $1"
