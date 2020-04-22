
#!/bin/sh

# we redeploy the contract so we start fresh, otherwise tests will fail

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

npx oz send-tx --to $contractAddr --network development --method initialize --args 0xD216153c06E857cD7f72665E0aF1d7D82172F494,0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B

npx oz-gsn fund-recipient --recipient $contractAddr --amount 100000000000000000

print_progress "contractAddr = $contractAddr"

# we write the updated contract address to the local.env file so it can use it on next run
sed -i '' -e "s!^\(ELAJSSTORE_CONTRACT_ADDR=\).*!\1$contractAddr!" ./env/local.env

END=`date +%s`

print_success "\nDone. Runtime: $((END-START)) seconds."

NODE_ENV=local node_modules/mocha/bin/mocha ./test/index.js --timeout 30000 --bail --exit
