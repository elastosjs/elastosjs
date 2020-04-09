#!/bin/sh

START=`date +%s`

print_progress () {
  printf "\e[0;33m$1\e[0m\n"
}

print_success () {
  printf "\e[4;32m$1\e[0m\n"
}

npx oz compile --solc-version 0.5.0 --evm-version byzantium

contractAddr=`npx oz deploy ELAJSStore --network elaethtest --kind regular`

npx oz send-tx --to $contractAddr --network elaethtest --method initialize

node ../oz-gsn/deploy-relayhub/run-fund.js $contractAddr

print_progress "contractAddr = $contractAddr"

# we write the updated contract address to the test.env file so it can use it on next run
sed -i '' -e "s!^\(ELAJSSTORE_CONTRACT_ADDR=\).*!\1$contractAddr!" ./env/elaethtest.env

END=`date +%s`

print_success "\nDone. Runtime: $((END-START)) seconds."
