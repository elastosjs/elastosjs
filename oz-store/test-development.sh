
# we redeploy the contract so we start fresh, otherwise tests will fail
sh ./deploy-development.sh

NODE_ENV=development node_modules/mocha/bin/mocha ./test/index.js --timeout 30000 --bail --exit
