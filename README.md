
# ElastosJS

### Documentation: https://docs.elastosjs.com

## Running Tests

Instructions for MacOS

1. The smart contract and tests are in `oz-store`, for the purposes of tests we recommend running a
few terminal windows so you can ensure all the components are working.

From the main elastosjs directory

`cd oz-store`

2. Setup Ganache CLI - This is your local Ethereum instance

Learn more at https://github.com/trufflesuite/ganache-cli

Ganache should already be included in the `devDependencies`, just run `npm install` to install it.

Open a new terminal window, we won't use `nohup` so we want a separate terminal.

`npx ganache-cli --deterministic --gasLimit 8000000 --gasPrice 1000000000 --db ganache-db`




## With thanks and credits to:

- Medici ETHDenver Hackathon Team (of which I was a part of)
- OpenZeppelin - EnumerableSets, GSN and more - https://openzeppelin.com/
- CoreUI - https://github.com/coreui/coreui-free-react-admin-template
- Leo Vigna (eth-sql) - https://github.com/leovigna/eth-sql
- Redux without Profanity - https://legacy.gitbook.com/book/tonyhb/redux-without-profanity/details
