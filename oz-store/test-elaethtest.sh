
# we redeploy the contract so we start fresh, otherwise tests will fail
sh ./deploy-elaethtest.sh

# if you are running this on testnet/mainnet the timeout needs to be much higher than 10000, probably 60000
NODE_ENV=elaethtest node_modules/mocha/bin/mocha ./test/index.js --timeout 180000 --bail --exit
