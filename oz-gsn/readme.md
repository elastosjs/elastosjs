We no longer use oz due to proxy issues


---

## Relayer Setup

Relayer generates a new RelayServerAddress (ETH Address)

This != the relayHubAddress, you can use the supplied eth contract address (from ./data.js - 0xd216153c06e857cd7f72665e0af1d7d82172f494) 
for this and the relayHub.deploy.tx is a pre-signed transaction to deploy that

Or use the RelayHub.sol I wrote in truffle-migrate, deploy that manually and use that contract address as the `relayHub.address`.

Then we need to set that on ENV var in relayer, then restart that.

Finally 
