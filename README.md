
# ElastosJS

## Documentation: https://docs.elastosjs.com

# Deploying (Testnet)

1. `sh deploy-testnet.sh`

    Double check:
    - it should copy and update `client/src/contracts/ELAJSStore-testnet.json`

# Running Tests

Instructions for MacOS

## 1. The smart contract and tests are in `oz-store`, so navigate to that

For the purposes of tests we recommend running a few terminal windows so you can ensure all the components are working.

From the main elastosjs directory

`cd oz-store`

## 2. Setup Ganache CLI - This is your local Ethereum instance

Learn more at https://github.com/trufflesuite/ganache-cli

Ganache should already be included in the `devDependencies`, just run `npm install` to install it.

Open a new terminal window, we won't use `nohup` so we want a separate terminal.

`npx ganache-cli --deterministic --gasLimit 8000000 --gasPrice 1000000000 --db ganache-db`

Our smart contracts rely on some other smart contracts which we'll need to deploy, so we start **ganache** in
deterministic mode, which means it saves the state and deployed smart contracts when we restart it. We use the `--db`
to specify that we want the blockchain files stored in the folder `ganache-db`.

If done correctly you should see a set of accounts (these won't change in deterministic mode) and the following:

```
Gas Price
==================
1000000000

Gas Limit
==================
8000000

Call Gas Limit
==================
9007199254740991

Listening on 127.0.0.1:8545
```

## 3. Now we start the local GSN Relayhub

GSN should already be installed if you ran `npm install`, it's the package: `@openzeppelin/gsn-helpers`.

Let's run it on port 8091: `npx oz-gsn run-relayer --ethereumNodeURL http://localhost:8545 --port 8091`

Done correctly you should see:

```
2020/04/21 19:53:36 RelayHttpServer.go:44: RelayHttpServer starting. version: 0.4.1
2020/04/21 19:53:36 RelayHttpServer.go:211: Using RelayHub address: 0xD216153c06E857cD7f72665E0aF1d7D82172F494
2020/04/21 19:53:36 RelayHttpServer.go:212: Using workdir: /var/folders/g2/sjmmz3w13q54sgwfbwnxjh_00000gn/T/tmp-51263WtxhnbSESSXS
2020/04/21 19:53:36 RelayHttpServer.go:214: Using dev mode
2020/04/21 19:53:36 RelayHttpServer.go:222: Constructing relay server in url  http://localhost:8091
2020/04/21 19:53:36 utils.go:40: ks accounts len 0
2020/04/21 19:53:36 utils.go:66: key extracted. addr: 0x6388799305A3A9eDE9B5d2b615914F2416B2e4eD
2020/04/21 19:53:36 RelayHttpServer.go:224: relay server address:  0x6388799305A3A9eDE9B5d2b615914F2416B2e4eD
```

*Take note of the RelayHub address, it should default to 0xD216153c06E857cD7f72665E0aF1d7D82172F494*

And it should be polling your **ganache**, which should show something like this:

```
eth_getBalance
eth_getLogs
eth_call
eth_getBalance
eth_getBlockByNum
```

If you use a different port you need to update `networks.js`, the **"test"** network needs to point to your ganache.

## 4. Now we need to deploy the DateTime Smart Contract

You'll see this contract in `contracts/DateTime.sol`, first let's compile our smart contracts.

`npx oz compile --solc-version 0.5.0 --evm-version byzantium`

You'll notice we are using `--evm-version byzantium` this is required as the Elastos ETH Sidechain is still a bit behind,
however this should change by May 2020 when it'll be upgraded.

After compiling you should see `✓ Compiled contracts with solc 0.5.0 (commit.1d4f565a)` along with some warnings, but you
can ignore the warnings, usually they are just superfluous variables we can optimize for, but we haven't yet since this is
still ALPHA.

`npx oz deploy DateTime --network test --kind regular`

We're using a regular deployment since OpenZeppelin 2.8 seems to have some issues with proxiable/upgradeable.

```
✓ Deployed instance of DateTime
0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B
```

Take note of the  DateTime contract address `0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B`

## 5. Modify the `test-local.sh` file with the addresses

Line ~22 in `test-local.sh` is the **initialize** method call, the args are the relayHubAddress followed by the DateTime address.

This is comma separated and cannot have spaces, for example based on this README, the line should be:

`npx oz send-tx --to $contractAddr --network development --method initialize --args 0xD216153c06E857cD7f72665E0aF1d7D82172F494,0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B`

You'll also notice an important line (~line 29) that looks like this

`sed -i '' -e "s!^\(ELAJSSTORE_CONTRACT_ADDR=\).*!\1$contractAddr!" ./env/local.env`

This will overwrite the contract address of the newly deployed storage contract address for the test, make sure this
`local.env` file exists in the `env` folder and has the line starting with `ELAJSSTORE_CONTRACT_ADDR=`.

## 6. Run the test

Now you should just be able to run `sh test-local.sh`

The result should be similar to the following:

```
✓ Deployed instance of ELAJSStore
✓ Transaction successful. Transaction hash: 0xc6198dfeca075b6f192b2c38af9d05537ae8460c60352adfba518d4cc4d2a87d
Events emitted: 
 - OwnershipTransferred(0x0000000000000000000000000000000000000000, 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1)
 - RelayHubChanged(0x0000000000000000000000000000000000000000, 0xD216153c06E857cD7f72665E0aF1d7D82172F494)
Recipient 0xe982E462b094850F12AF94d21D470e21bE9D0E9C balance is now 100000000000000000 wei
contractAddr = 0xe982E462b094850F12AF94d21D470e21bE9D0E9C

Done. Runtime: 4 seconds.
http://127.0.0.1:8545


  ELAJS Store Tests
Setting up smart contracts
DONE setup
    Tests for Table Schema
      - Should test against the gsnCounter limit
    Tests GsnMaxCallsPerDay
      - Should set the GSNMaxCallsPerDay
    Tests for Insert Private Table
      - Should fail to create a table, because only owner can
      - Should CREATE the table
      - Should check if the table exists
      - Should FAIL because only owner can INSERT on this table
      - Should INSERT a test value (uint)
      - Should INSERT a test value (str)
    Tests for Insert Public Table
      ✓ Should create a table (145ms)
      ✓ Should INSERT a test value (str) with 1 field to an ID (832ms)
      ✓ Should INSERT a test value (int, str) with multiple fields to an ID (1110ms)
      ✓ Should UPDATE a test value (str) (524ms)
      ✓ Should DELETE a the global test id value (1033ms)
      ✓ Should delete a row with 2 vals (1476ms)
      - Should insert multiple fields/cols for a row
      - Should insert multiple fields/cols for a row - 2
    Tests for Namehash
      ✓ Should match final namehash for foo.eth
    Tests for Table Schema
      ✓ Should create a table with a schema and return it (290ms)


  8 passing (5s)
  10 pending
```

# With thanks and credits to:

- Medici ETHDenver Hackathon Team (of which I was a part of)
- OpenZeppelin - EnumerableSets, GSN and more - https://openzeppelin.com/
- CoreUI - https://github.com/coreui/coreui-free-react-admin-template
- Leo Vigna (eth-sql) - https://github.com/leovigna/eth-sql
- Redux without Profanity - https://legacy.gitbook.com/book/tonyhb/redux-without-profanity/details
