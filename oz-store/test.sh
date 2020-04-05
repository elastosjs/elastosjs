
sh ./deploy.sh

node_modules/mocha/bin/mocha ./test/index.js --timeout 10000 --bail --exit
