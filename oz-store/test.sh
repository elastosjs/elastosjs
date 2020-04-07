
# we redeploy the contract so we start fresh, otherwise tests will fail
sh ./deploy.sh

node_modules/mocha/bin/mocha ./test/index.js --timeout 10000 --bail --exit
