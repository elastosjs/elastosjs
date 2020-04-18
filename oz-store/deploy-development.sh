#!/bin/sh

# This is for local development only

START=`date +%s`

print_progress () {
  printf "\e[0;33m$1\e[0m\n"
}

print_success () {
  printf "\e[4;32m$1\e[0m\n"
}

npx oz compile --solc-version 0.5.0 --evm-version byzantium

contractAddr=`npx oz deploy ELAJSStore --network development --kind regular`

npx oz send-tx --to $contractAddr --network development --method initialize

npx oz-gsn fund-recipient --recipient $contractAddr --amount 100000000000000000

print_progress "contractAddr = $contractAddr"

# copy the contract JSON for the client
cp -f ./build/contracts/ELAJSStore.json ../client/src/contracts/ELAJSStore-development.json

# update the contract address for the client
sed -i '' -e "s!\(elajsStore: '\).*!\1$contractAddr'!" ../client/src/config.js

# we write the updated contract address to the development.env file
sed -i '' -e "s!^\(ELAJSSTORE_CONTRACT_ADDR=\).*!\1$contractAddr!" ./env/development.env

# copy the contract JSON for ela-js
cp -f ./build/contracts/ELAJSStore.json ~/workspace/ela-js/src/contracts/ELAJSStore.json

END=`date +%s`

print_success "\nDone. Runtime: $((END-START)) seconds."

exit 1
