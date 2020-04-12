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

# we write the updated contract address to the test.env file so it can use it on next run
sed -i '' -e "s!^\(ELAJSSTORE_CONTRACT_ADDR=\).*!\1$contractAddr!" ./env/test.env

END=`date +%s`

print_success "\nDone. Runtime: $((END-START)) seconds."

exit 1
