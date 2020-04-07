pragma solidity ^0.5.0;

import "sol-datastructs/src/contracts/PolymorphicDictionaryLib.sol";

// this is included by PolymorphicDictionaryLib, but added here for verbosity
import "sol-datastructs/src/contracts/Bytes32DictionaryLib.sol";

// import "./oz/EnumerableSetDictionary.sol";

import "./ozEla/OwnableELA.sol";
import "./gsnEla/GSNRecipientELA.sol";
import "./gsnEla/IRelayHubELA.sol";

contract ELAJSStore is OwnableELA, GSNRecipientELA {

    using PolymorphicDictionaryLib for PolymorphicDictionaryLib.PolymorphicDictionary;
    using Bytes32DictionaryLib for Bytes32DictionaryLib.Bytes32Dictionary;

    uint8 public version;

    // _table = system table (bytes32 Dict) of each table's metadata marshaled
    // 8 bits - permissions (00 = system, 01 = private, 10 = public, 11 = shared - owner can always edit)
    // 20 bytes - address delegate - other address allowed to edit, unimplemented (likely implemented as multi-sig address)
    Bytes32DictionaryLib.Bytes32Dictionary internal _table;

    // table = dict where the key is the table, and the value is a set of byte32 ids
    PolymorphicDictionaryLib.PolymorphicDictionary internal table;

    // ownership of each row (id) - key = namehash([id].[table]) - value = address
    // this isn't used for private tables
    mapping(bytes32 => address) internal elajsRowOwner;

    // ultimately namehash([field].[id].[table]) gives us a bytes32 which maps to the single data value
    mapping(bytes32 => bytes32) internal elajsStore;


    function initialize() public initializer {
        OwnableELA.initialize(msg.sender);
        GSNRecipientELA.initialize();
        _initialize();
    }

    function _initialize() internal {

        // test = 0x04f740db81dc36c853ab4205bddd785f46e79ccedca351fc6dfcbd8cc9a33dd6
        // setTableMetadata(0x04f740db81dc36c853ab4205bddd785f46e79ccedca351fc6dfcbd8cc9a33dd6, 2, 1, 0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e);
    }


    // ************************************* SCHEMA FUNCTIONS *************************************
    /**
     * @dev create a new table, only the owner may create this
     */
    function createTable(bytes32 tableKey, uint8 permission) public onlyOwner {

        // check if table exists
        require(_table.containsKey(tableKey) == false, "Table already exists");

        address delegate = address(0x0);

        // claim the key slot and set the metadata
        setTableMetadata(tableKey, permission, delegate);

        table.addKey(tableKey, PolymorphicDictionaryLib.DictionaryType.OneToManyFixed);

    }

    function tableExists(bytes32 tableKey) public view returns (bool) {
        return table.containsKey(tableKey);
    }

    // ************************************* CRUD FUNCTIONS *************************************

    /**
     * @dev Table level permission checks
     */
    modifier insertCheck(bytes32 tableKey, bytes32 idKey, bytes32 idTableKey) {

        (uint256 permission, address delegate) = getTableMetadata(tableKey);

        // if permission = 0, system table we can't do anything
        require(permission > 0, "Cannot insert into system table");

        // if permission = 1, we must be the owner/delegate
        require(permission > 1 || isOwner() == true || delegate == _msgSender(), "Only owner/delegate can insert into this table");

        // permissions check, is the idTableKey a subhash of the id and table?
        require(isNamehashSubOf(idKey, tableKey, idTableKey) == true, "idTableKey not a subhash [id].[table]");

        // IF this is a public table, for a each row, we add an entry in `elajsRowOwner` claiming this [id].[table] for the msg.sender
        if (permission > 1) {
            elajsRowOwner[idTableKey] = _msgSender();
        }

        _;
    }

    /**
     * @dev Prior to insert, we check the permissions and autoIncrement
     * TODO: use the schema and determine the proper type of data to insert
     *
     * @param tableKey the namehashed [table] name string
     * @param idKey the sha3 hashed idKey
     * @param idTableKey the namehashed [id].[table] name string
     *
     * @param id as the raw string (unhashed)
     *
     *
     */
    function insertTestVal(

        bytes32 tableKey,
        bytes32 idTableKey,
        bytes32 fieldIdTableKey,

        bytes32 idKey,
        bytes32 fieldKey,

        bytes32 id,
        uint256 val)

    public insertCheck(tableKey, idKey, idTableKey){

        // add an id entry to the table's set of ids for the row
        table.addValueForKey(tableKey, id);

        // now check if the full field + id + table is a subhash
        require(isNamehashSubOf(fieldKey, idTableKey, fieldIdTableKey) == true, "fieldKey not a subhash [field].[id].[table]");

        // finally set the data
        // we won't serialize the type, that's way too much redundant data
        elajsStore[fieldIdTableKey] = bytes32(val);
    }

    /**
     * @dev Table actual insert call
     */
    function insert(
        bytes32 tableKey,
        bytes32 idTableKey,

        bytes32 idKey,
        bytes32 id,

        bytes32[] memory fieldKeys,
        bytes32[] memory fieldIdTableKeys,
        bytes32[] memory values)

    public insertCheck(tableKey, idKey, idTableKey){

        uint len = fieldKeys.length;

        require(fieldKeys.length == values.length, "fields, values array length mismatch");

        // add an id entry to the table's set of ids for the row
        table.addValueForKey(tableKey, id);

        for (uint i = 0; i < len; i++) {

            // for each row check if the full field + id + table is a subhash
            require(isNamehashSubOf(fieldKeys[i], idTableKey, fieldIdTableKeys[i]) == true, "fieldKey not a subhash [field].[id].[table]");

            elajsStore[fieldIdTableKeys[i]] = bytes32(values[i]);
        }

    }

    function getValTest(bytes32 dataKey) public view returns (bytes32) {
        return bytes32(elajsStore[dataKey]);
    }

    /**
     * Getting a row,
     */
    function getRow(bytes32 tableKey, bytes32 idKey, bytes32) public {

    }

    function isNamehashSubOf(bytes32 subKey, bytes32 base, bytes32 target) public pure returns (bool) {

        bytes memory concat = new bytes(64);

        assembly {
            mstore(add(concat, 64), subKey)
            mstore(add(concat, 32), base)
        }

        bytes32 result = keccak256(concat);

        return result == target;
    }


    // ************************************* _TABLE FUNCTIONS *************************************
    function getTableMetadata(bytes32 _tableKey)
        view
        public
        returns (uint256 permission, address delegate)
    {
        require(_table.containsKey(_tableKey) == true, "table does not exist");

        uint256 tableMetadata = uint256(_table.getValueForKey(_tableKey));

        permission = uint256(uint8(tableMetadata));
        delegate = address(tableMetadata>>8);
    }

    function setTableMetadata(bytes32 _tableKey, uint8 permission, address delegate) private onlyOwner returns (bool) {
        uint256 tableMetadata;

        tableMetadata |= permission;
        tableMetadata |= uint160(delegate)<<8;

        return _table.setValueForKey(_tableKey, bytes32(tableMetadata));
    }

    // ************************************* MISC FUNCTIONS *************************************

    function increaseVersion() public {
        version += 1;
    }

    function() external payable {}

    // ************************************* GSN FUNCTIONS *************************************

    function acceptRelayedCall(
        address relay,
        address from,
        bytes calldata encodedFunction,
        uint256 transactionFee,
        uint256 gasPrice,
        uint256 gasLimit,
        uint256 nonce,
        bytes calldata approvalData,
        uint256 maxPossibleCharge
    ) external view returns (uint256, bytes memory) {
        return _approveRelayedCall();
    }

    // We won't do any pre or post processing, so leave _preRelayedCall and _postRelayedCall empty
    function _preRelayedCall(bytes memory context) internal returns (bytes32) {
    }

    function _postRelayedCall(bytes memory context, bool, uint256 actualCharge, bytes32) internal {
    }

    /**
     * @dev Withdraw a specific amount of the GSNReceipient funds
     * @param amt Amount of wei to withdraw
     * @param dest This is the arbitrary withdrawal destination address
     */
    function withdraw(uint256 amt, address payable dest) public onlyOwner {
        IRelayHubELA relayHub = getRelayHub();
        relayHub.withdraw(amt, dest);
    }

    /**
     * @dev Withdraw all the GSNReceipient funds
     * @param dest This is the arbitrary withdrawal destination address
     */
    function withdrawAll(address payable dest) public onlyOwner returns (uint256) {
        IRelayHubELA relayHub = getRelayHub();
        uint256 balance = getRelayHub().balanceOf(address(this));
        relayHub.withdraw(balance, dest);
        return balance;
    }

    function getRelayHub() internal view returns (IRelayHubELA) {
        return IRelayHubELA(_getRelayHub());
    }
}
