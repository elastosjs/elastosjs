pragma solidity ^0.5.0;

import "sol-datastructs/src/contracts/PolymorphicDictionaryLib.sol";

// this is included by PolymorphicDictionaryLib, but added here for verbosity
import "sol-datastructs/src/contracts/Bytes32DictionaryLib.sol";

// import "./oz/EnumerableSetDictionary.sol";

import "./ozEla/OwnableELA.sol";
import "./gsnEla/GSNRecipientELA.sol";
import "./gsnEla/IRelayHubELA.sol";

contract DateTime {
    function getYear(uint timestamp) public pure returns (uint16);
    function getMonth(uint timestamp) public pure returns (uint8);
    function getDay(uint timestamp) public pure returns (uint8);
}

contract ELAJSStore is OwnableELA, GSNRecipientELA {

    // DateTime Contract address
    // address public dateTimeAddr = 0x9c71b2E820B067ea466ea81C0cd6852Bc8D8604e; // development
    address public dateTimeAddr = 0xEDb211a2dBbdE62012440177e65b68E0A66E4531; // testnet

    // Initialize the DateTime contract ABI with the already deployed contract
    DateTime dateTime = DateTime(dateTimeAddr);

    // This counts the number of times this contract was called via GSN (expended owner gas) for rate limiting
    // mapping is a keccak256('YYYY-MM-DD') => uint (TODO: we can probably compress this by week (4 bytes per day -> 28 bytes)
    mapping(bytes32 => uint256) public gsnCounter;

    // Max times we allow this to be called per day
    uint40 public gsnMaxCallsPerDay;

    using PolymorphicDictionaryLib for PolymorphicDictionaryLib.PolymorphicDictionary;
    using Bytes32DictionaryLib for Bytes32DictionaryLib.Bytes32Dictionary;

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


    // ************************************* SETUP FUNCTIONS *************************************
    function initialize() public initializer {
        OwnableELA.initialize(msg.sender);
        GSNRecipientELA.initialize();
        _initialize();
    }

    function _initialize() internal {

        gsnMaxCallsPerDay = 1000;
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
        require(permission > 0, "Cannot INSERT into system table");

        // if permission = 1, we must be the owner/delegate
        require(permission > 1 || isOwner() == true || delegate == _msgSender(), "Only owner/delegate can INSERT into this table");

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
    function insertVal(

        bytes32 tableKey,
        bytes32 idTableKey,
        bytes32 fieldIdTableKey,

        bytes32 idKey,
        bytes32 fieldKey,

        bytes32 id,
        bytes32 val)

    public insertCheck(tableKey, idKey, idTableKey){

        // How does this handle multiple fields for a row? Actually why isn't this failing on multiple inserts?
        // require(table.containsValueForKey(tableKey, id) == false, "id already exists");

        // now check if the full field + id + table is a subhash
        require(isNamehashSubOf(fieldKey, idTableKey, fieldIdTableKey) == true, "fieldKey not a subhash [field].[id].[table]");

        // increment counter
        // increaseGsnCounter();

        // add an id entry to the table's set of ids for the row
        table.addValueForKey(tableKey, id);

        // finally set the data
        // we won't serialize the type, that's way too much redundant data
        elajsStore[fieldIdTableKey] = bytes32(val);
    }

    modifier updateCheck(bytes32 tableKey, bytes32 idKey, bytes32 idTableKey) {

        (uint256 permission, address delegate) = getTableMetadata(tableKey);

        // if permission = 0, system table we can't do anything
        require(permission > 0, "Cannot UPDATE system table");

        // if permission = 1, we must be the owner/delegate
        require(permission > 1 || isOwner() == true || delegate == _msgSender(), "Only owner/delegate can UPDATE into this table");

        // permissions check, is the idTableKey a subhash of the id and table?
        require(isNamehashSubOf(idKey, tableKey, idTableKey) == true, "idTableKey not a subhash [id].[table]");

        // permissions check (public table = 2, shared table = 3),
        // if 2 or 3 is the _msg.sender() the row owner? But if 3 owner() is always allowed
        if (permission >= 2) {
            if (isOwner() || delegate == _msgSender()){
                // pass
            } else {
                require(elajsRowOwner[idTableKey] == _msgSender(), "Sender not owner of row");
            }
        }

        _;
    }

    function updateVal(

        bytes32 tableKey,
        bytes32 idTableKey,
        bytes32 fieldIdTableKey,

        bytes32 idKey,
        bytes32 fieldKey,

        bytes32 id,
        bytes32 val)

    public updateCheck(tableKey, idKey, idTableKey) {

        require(table.containsValueForKey(tableKey, id) == true, "id doesn't exist, use INSERT");

        // now check if the full field + id + table is a subhash
        require(isNamehashSubOf(fieldKey, idTableKey, fieldIdTableKey) == true, "fieldKey not a subhash [field].[id].[table]");

        // increment counter
        // increaseGsnCounter();

        // set data (overwrite)
        elajsStore[fieldIdTableKey] = bytes32(val);

    }

    modifier deleteCheck(bytes32 tableKey, bytes32 idTableKey, bytes32 idKey, bytes32 id) {

        require(table.containsValueForKey(tableKey, id) == true, "id doesn't exist");

        _;
    }

    /**
     * @dev TODO: add modifier checks based on update
     *
     * TODO: this needs to properly remove the row when there are multiple ids
     *
     */
    function deleteVal(

        bytes32 tableKey,
        bytes32 idTableKey,

        bytes32 idKey,
        bytes32 id,

        bytes32 fieldKey,
        bytes32 fieldIdTableKey

    ) public deleteCheck(tableKey, idTableKey, idKey, id){



        // check if the full field + id + table is a subhash (permissions)
        require(isNamehashSubOf(fieldKey, idTableKey, fieldIdTableKey) == true, "fieldKey not a subhash [field].[id].[table]");

        // zero out the data
        elajsStore[fieldIdTableKey] = bytes32(0);

        // increment counter
        // increaseGsnCounter();

        // we can't really pass in enough data to make a loop worthwhile
        /*
        uint8 len = uint8(fieldKeys.length);
        require(fieldKeys.length == fieldIdTableKeys.length, "fields, id array length mismatch");
        for (uint8 i = 0; i < len; i++) {

            // for each row check if the full field + id + table is a subhash
            // require(isNamehashSubOf(fieldKeys[i], idTableKey, fieldIdTableKeys[i]) == true, "fieldKey not a subhash [field].[id].[table]");

            // zero out the data
            elajsStore[fieldIdTableKeys[i]] = bytes32(0);
        }
        */

    }

    function deleteRow(

        bytes32 tableKey,
        bytes32 idTableKey,

        bytes32 idKey,
        bytes32 id

    ) public deleteCheck(tableKey, idTableKey, idKey, id){

        // remove the id
        table.removeValueForKey(tableKey, id);
    }

    /**
     * @dev Table actual insert call, NOTE this doesn't work on testnet currently due to a stack size issue,
     *      but it can work with a paid transaction I guess
     */
    /*
    function insert(
        bytes32 tableKey,
        bytes32 idTableKey,

        bytes32 idKey,
        bytes32 id,

        bytes32[] memory fieldKeys,
        bytes32[] memory fieldIdTableKeys,
        bytes32[] memory values)

    public insertCheck(tableKey, idKey, idTableKey){

        require(table.containsValueForKey(tableKey, id) == false, "id already exists");

        uint len = fieldKeys.length;

        require(fieldKeys.length == fieldIdTableKeys.length == values.length, "fields, values array length mismatch");

        // add an id entry to the table's set of ids for the row
        table.addValueForKey(tableKey, id);

        for (uint i = 0; i < len; i++) {

            // for each row check if the full field + id + table is a subhash
            require(isNamehashSubOf(fieldKeys[i], idTableKey, fieldIdTableKeys[i]) == true, "fieldKey not a subhash [field].[id].[table]");

            elajsStore[fieldIdTableKeys[i]] = bytes32(values[i]);
        }

    }
    */

    /**
     * @dev all data is public, so no need for security checks, we leave the data type handling to the client
     */
    function getRowValue(bytes32 dataKey) public view returns (bytes32) {
        return bytes32(elajsStore[dataKey]);
    }

    /**
     * @dev Warning this produces an Error: overflow (operation="setValue", fault="overflow", details="Number can only safely store up to 53 bits")
     *      if the table doesn't exist
     */
    function getTableIds(bytes32 tableKey) external view returns (bytes32[] memory){

        require(table.containsKey(tableKey) == true, "table not created");

        return table.getBytes32ArrayForKey(tableKey);
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

    function() external payable {}

    // ************************************* GSN FUNCTIONS *************************************

    /**
     * As a first layer of defense we employ a max number of checks per day
     */
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

        // TODO: check gsnCounter and compare to limit

        return _approveRelayedCall();
    }

    function setGsnMaxCallsPerDay(uint256 max) external onlyOwner {
        gsnMaxCallsPerDay = uint40(max);
    }

    function increaseGsnCounter() internal {

        bytes memory curDate = new bytes(4);

        uint16 year = dateTime.getYear(now);
        uint8 month = dateTime.getMonth(now);
        uint8 day = dateTime.getDay(now);

        assembly {
            mstore(add(curDate, 4), year)
            mstore(add(curDate, 2), month)
            mstore(add(curDate, 1), day)
        }

        bytes32 curDateHashed = keccak256(curDate);

        uint256 curCounter = gsnCounter[curDateHashed];

        gsnCounter[curDateHashed] = curCounter + 1;
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

    function getGSNBalance() public view returns (uint256) {
        return getRelayHub().balanceOf(address(this));
    }

    function getRelayHub() internal view returns (IRelayHubELA) {
        return IRelayHubELA(_getRelayHub());
    }
}
