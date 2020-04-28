
#!/bin/sh

# For ELA Testnet only - I am hardcoding my testnet address too

START=`date +%s`

print_progress () {
  printf "\e[0;33m$1\e[0m\n"
}

print_success () {
  printf "\e[4;32m$1\e[0m\n"
}

# we redeploy the contract so we start fresh, otherwise tests will fail

npx oz compile --solc-version 0.5.0 --evm-version byzantium

contractAddr=`npx oz deploy ELAJSStore --network elaethtest --kind regular`

npx oz send-tx --to $contractAddr --network elaethtest --method initialize --args 0x2EDA8d1A61824dFa812C4bd139081B9BcB972A6D,0xEDb211a2dBbdE62012440177e65b68E0A66E4531

node ../oz-gsn/deploy-relayhub/run-fund.js $contractAddr

print_progress "contractAddr = $contractAddr"

# we write the updated contract address to the testnet.env file so it can use it on next run
sed -i '' -e "s!^\(ELAJSSTORE_CONTRACT_ADDR=\).*!\1$contractAddr!" ./env/testnet.env

# if you are running this on testnet/mainnet the timeout needs to be much higher than 10000, probably 60000
NODE_ENV=testnet node_modules/mocha/bin/mocha ./test/index.js --timeout 180000 --bail --exit

npx oz send-tx --network elaethtest --method withdrawAll --args 0x243C7B804a1CB650c3f584FaC5e33FdB61Cd26CE --to $contractAddr

END=`date +%s`

print_success "\nDone. Runtime: $((END-START)) seconds."
