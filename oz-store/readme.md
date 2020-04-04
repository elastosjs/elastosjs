This is a Google Doc at https://docs.google.com/document/d/1yduxdHDARpbJ2siBA_nVHv3a4Zw4i6uYBALrRw13Zoc

TODO: move this to a properly formatted MD doc here

The ElastosJS Storage Smart Contracts make heavy use of OpenZeppelin's EnumerableSet feature at https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/EnumerableSet.sol. The amazing thing is that with an EnumerableSet you can easily extend that to create proper Dictionaries to map a key to a value.
Another key invention is namehash, which allows us to avoid expensive string manipulation on a smart contract, yet we can still verify that a final hash is a subdomain of previous checked table permissions.
How It Works Under the Hood
Everything is stored accessible via a byte32 hash. System tables are prefixed with _ and we prevent creation of tables starting with an underscore except by the system.
A period is also not allowed in a field name.
Data Layout
Immediately at the root we have the system table _table which is a Dictionary of all the tables, each table key is mapped to a bytes32 that marshals metadata about that table including:
permissions_type - 2 bit
00 = system table (future proofing for any future tables we use internally, also checking an underscore is a bit hacky)
01 = private
10 = public
11 = public & owner can modify any record
auto_increment - uint40 (5 bytes should be enough rows to be future proof, 1 trillion rows)
delegate - address (bytes20) - another owner, we’d want to use gnosis multi-sig
2 bits + 40 bits + 160 bits = 202 bits
Simple Checks
Since _table is a dictionary, we can quickly check the existence of a table by using containsKey.

Table deletion would involve zeroing out all data, not supported currently. But key removal is supported, the data would still be there though.
Schema Tables
For each table we also create a system table for the schema, e.g. table foo has a table named _foo
This system table is a dictionary where each key is a field_name and is mapped to a type. We use a bytes32 here so in the future we can store additional metadata such as indexes or relational constraints.
TODO: use Table lib here? Then we only need a set and we cache the schema.
But on insertion I need a containsKey check.
When [table_name] is hashed, it points to an EnumerableSet of IDs, on insertion we check the table’s auto_increment value and increment it for the next ID. TODO: any reason for this to be a dictionary? What could we store as the value of a table hash key? Owner/created_by? Then this could be blank for a private table? How does this work for data storage?
‌
Then hashing [table_name].[id].[field_name] returns a specific value.

However to maintain a proper schema we track schema in system tables much like regular SQL databases.

Data Storage
We want to ensure O(1) insertion, update and retrieval, so data is always a single value retrieved via a hash. You can determine the data type by fetching the analogous system table?

Searching by id works but how to search on a field value? 

Data Access
Ensure we don’t accept an arbitrary modification hash key!

WHERE
Brute force WHERE statement query for now, external reads are free anyway, reverse the hash e.g. id.table_name then iterate through each field, hashing and querying for data, then filter client side.

Currently no subscriptions so we can’t really sync the redux with the smart contract.

As an improvement for our own records, on a public table where only we can change them, we can always use the cached values.

INSERT
User passes the param which is a hash of the key, but we need to extract the table, so ultimately we execute 3 transactions.

Pass in the namehash(table_name) - check if the table exists, then we need this to fetch the auto_increment and permissions. We know the owner of the contract through Ownable so if it’s private only he can write to it.

If the owner doesn’t match and the table is private, we can shortcut here on the client side.


ELSE we can continue (public/shared both can insert). Fetch the next id in a transaction and increment. Solidity is sequential, there are no issues about concurrency, only concern is malicious inserts. Therefore we check with containsKey before the final insert just to be sure.


Insert a key for the id with the value as the owner of the row, now containsKey should be true.


Client side pre-hash the insert hashes for each field, as: [field_name].[id].[table_name] and pass in as a bytes32 key array (final hash) + value array, as well as the namehash(table_name) again for permission check.

Each insert is O(1) and we don’t do schema checking for now, but we do need to do a permission + collision check via containsKey, which shouldn’t happen unless someone was malicious and used an id without incrementing.


Permission check - internally call the step 1 permission check


Pre-calc: namehash(id.table_name) 


For each insert field, verify the namehash of the final hash is a sub of namehash(id.table_name) - so sha3(namehash(id.table_name) + sha3(field) should equal the requested final hash.

UPDATE
This is the most complicated action, we need to check if the owner has rights to edit the row.

We start same as INSERT, where we check the table metadata:

Pass in the namehash(table_name) - check if the table exists, then we need this to fetch the auto_increment and permissions. We know the owner of the contract through Ownable so if it’s private only he can write to it.

If the owner doesn’t match and the table is private, we can shortcut here on the client side.







Rate Limiting
We want to have an adjustable daily max per user and overall, this is to limit gas usage and nefarious activities. Ultimately the developer needs to use the GSN accept call to whitelist users.
Two MODES for Schema Management
By default the smart contracts validate any data changes against the schema, however to conserve gas and relax constraints we also support caching the schema off-chain and letting the SDK handle all schema validation. This could potentially cause issues if there were bugs in the SDK, but that's up to you if you'd like to conserve gas.
Other Considerations

Should there be a max size of columns/fields?
