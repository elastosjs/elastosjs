#!/bin/sh

# This is for testnet - deploy only

START=`date +%s`

print_progress () {
  printf "\e[0;33m$1\e[0m\n"
}

print_success () {
  printf "\e[4;32m$1\e[0m\n"
}

npx oz compile --solc-version 0.5.0 --evm-version byzantium

contractAddr=`npx oz deploy ELAJSStore --network elaethtest --kind regular`

npx oz send-tx --to $contractAddr --network elaethtest --method initialize --args 0x2EDA8d1A61824dFa812C4bd139081B9BcB972A6D

node ../oz-gsn/deploy-relayhub/run-fund.js $contractAddr

print_progress "contractAddr = $contractAddr"

# update the contract address for the client
sed -i '' -e "s!\(databaseContractAddr: '\).*!\1$contractAddr',!" ../client/src/config/testnet.js

# we write the updated contract address to the testnet.env file - for local tests
sed -i '' -e "s!^\(ELAJSSTORE_CONTRACT_ADDR=\).*!\1$contractAddr!" ./env/testnet.env

# copy the contract JSON for ela-js (always do this regardless of the network)
cp -f ./build/contracts/ELAJSStore.json ~/workspace/ela-js/src/contracts/ELAJSStore.json

END=`date +%s`

print_success "\nDone. Runtime: $((END-START)) seconds."

exit 1
