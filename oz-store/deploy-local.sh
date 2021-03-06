#!/bin/sh

# This is for local - deploy only

START=`date +%s`

print_progress () {
  printf "\e[0;33m$1\e[0m\n"
}

print_success () {
  printf "\e[4;32m$1\e[0m\n"
}

npx oz compile --solc-version 0.5.0 --evm-version byzantium

contractAddr=`npx oz deploy ELAJSStore --network local --kind regular`

npx oz send-tx --to $contractAddr --network local --method initialize --args 0xD216153c06E857cD7f72665E0aF1d7D82172F494

npx oz-gsn fund-recipient --recipient $contractAddr --amount 100000000000000000

print_progress "contractAddr = $contractAddr"

# update the contract address for the client
sed -i '' -e "s!\(databaseContractAddr: '\).*!\1$contractAddr',!" ../client/src/config/local.js

# we write the updated contract address to the local.env file - for local tests
sed -i '' -e "s!^\(ELAJSSTORE_CONTRACT_ADDR=\).*!\1$contractAddr!" ./env/local.env

# copy the contract JSON for ela-js (always do this regardless of the network)
cp -f ./build/contracts/ELAJSStore.json ~/workspace/ela-js/src/contracts/ELAJSStore.json

END=`date +%s`

print_success "\nDone. Runtime: $((END-START)) seconds."

exit 1
