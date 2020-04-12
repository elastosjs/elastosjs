pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

import "sol-datastructs/src/contracts/PolymorphicDictionaryLib.sol";

import "sol-datastructs/src/contracts/Bytes32DictionaryLib.sol";
import "sol-datastructs/src/contracts/Bytes32SetDictionaryLib.sol";

// import "./oz/EnumerableSetDictionary.sol";

import "sol-sql/src/contracts/src/structs/TableLib.sol";

import "./ozEla/OwnableELA.sol";
import "./gsnEla/GSNRecipientELA.sol";
import "./gsnEla/IRelayHubELA.sol";

contract DateTime {
    function getYear(uint timestamp) public pure returns (uint16);
    function getMonth(uint timestamp) public pure returns (uint8);
    function getDay(uint timestamp) public pure returns (uint8);
}

// TODO: good practice to have functions not callable externally and internally
contract ELAJSStore is OwnableELA, GSNRecipientELA {

    // key to our table list
    bytes32 constant public schemasTables = 0x736368656d61732e7075626c69632e7461626c65730000000000000000000000;

    // DateTime Contract address
    address public dateTimeAddr = 0x9c71b2E820B067ea466ea81C0cd6852Bc8D8604e; // development
    // address constant public dateTimeAddr = 0xEDb211a2dBbdE62012440177e65b68E0A66E4531; // testnet

    // Initialize the DateTime contract ABI with the already deployed contract
    DateTime dateTime = DateTime(dateTimeAddr);

    // This counts the number of times this contract was called via GSN (expended owner gas) for rate limiting
    // mapping is a keccak256('YYYY-MM-DD') => uint (TODO: we can probably compress this by week (4 bytes per day -> 28 bytes)
    mapping(bytes32 => uint256) public gsnCounter;

    // Max times we allow this to be called per day
    uint40 public gsnMaxCallsPerDay;

    using PolymorphicDictionaryLib for PolymorphicDictionaryLib.PolymorphicDictionary;
    using Bytes32DictionaryLib for Bytes32DictionaryLib.Bytes32Dictionary;
    using Bytes32SetDictionaryLib for Bytes32SetDictionaryLib.Bytes32SetDictionary;

    // _table = system table (bytes32 Dict) of each table's metadata marshaled
    // 8 bits - permissions (00 = system, 01 = private, 10 = public, 11 = shared - owner can always edit)
    // 20 bytes - address delegate - other address allowed to edit
    mapping(bytes32 => bytes32) internal _table;

    // table = dict, where the key is the table, and the value is a set of byte32 ids
    Bytes32SetDictionaryLib.Bytes32SetDictionary internal table;

    // Schema dictionary, key (schemasPublicTables) points to a set of table names
    using TableLib for TableLib.Table;
    using TableLib for bytes;
    // using ColumnLib for ColumnLib.Column;
    // using ColumnLib for bytes;

    // namehash([tableName]) => encoded table schema
    // ownership of each row (id) - key = namehash([id].[table]) which has a value that is the owner's address
    // ultimately namehash([field].[id].[table]) gives us a bytes32 which maps to the single data value
    PolymorphicDictionaryLib.PolymorphicDictionary internal database;


    // ************************************* SETUP FUNCTIONS *************************************
    function initialize() public initializer {
        OwnableELA.initialize(msg.sender);
        GSNRecipientELA.initialize();
        _initialize();
    }

    function _initialize() internal {
        gsnMaxCallsPerDay = 1000;
    }

    // ************************************* SCHEMA FUNCTIONS *************************************
    /**
     * @dev create a new table, only the owner may create this
     *
     * @param tableKey this is the namehash of tableName
     */
    function createTable(

        bytes32 tableName,
        bytes32 tableKey,
        uint8 permission,
        bytes32[] memory _columnName,
        bytes32[] memory _columnDtype

    ) public onlyOwner {

        // check if table exists
        require(_table[tableKey] == 0, "Table already exists");

        address delegate = address(0x0);

        // claim the key slot and set the metadata
        setTableMetadata(tableKey, permission, delegate);

        // table stores the row ids set as the value, set up the key
        table.addKey(tableKey);

        // now insert the schema
        TableLib.Table memory tableSchema = TableLib.create(
            tableName,
            _columnName,
            _columnDtype
        );

        saveSchema(tableKey, tableSchema);

    }

    function tableExists(bytes32 tableKey) public view returns (bool) {
        return table.containsKey(tableKey);
    }

    function saveSchema(bytes32 tableKey, TableLib.Table memory tableSchema) internal returns (bool) {
        bytes memory encoded = tableSchema.encode();

        // we store the encoded table schema on the base tableKey
        return database.setValueForKey(tableKey, encoded);
    }

    // EXPERIMENTAL
    function getSchema(bytes32 _name) public view returns (TableLib.Table memory) {
        bytes memory encoded = database.getBytesForKey(_name);
        return encoded.decodeTable();
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

        require(database.containsKey(fieldIdTableKey) == false, "id+field already exists");

        // now check if the full field + id + table is a subhash
        require(isNamehashSubOf(fieldKey, idTableKey, fieldIdTableKey) == true, "fieldKey not a subhash [field].[id].[table]");

        // increment counter
        increaseGsnCounter();

        // add an id entry to the table's set of ids for the row
        table.addValueForKey(tableKey, id);

        // add the "row owner" if it doesn't exist, the row may already exist in which case we don't update it
        if (database.containsKey(idTableKey) == false){
            _setRowOwner(idTableKey);
        }

        // finally set the data
        // we won't serialize the type, that's way too much redundant data
        database.setValueForKey(fieldIdTableKey, bytes32(val));
    }

    function insertValVar(
        bytes32 tableKey,
        bytes32 idTableKey,
        bytes32 fieldIdTableKey,

        bytes32 idKey,
        bytes32 fieldKey,

        bytes32 id,
        bytes memory val)

    public insertCheck(tableKey, idKey, idTableKey){

        require(database.containsKey(fieldIdTableKey) == false, "id+field already exists");

        // now check if the full field + id + table is a subhash
        require(isNamehashSubOf(fieldKey, idTableKey, fieldIdTableKey) == true, "fieldKey not a subhash [field].[id].[table]");

        // increment counter
        increaseGsnCounter();

        // add an id entry to the table's set of ids for the row
        table.addValueForKey(tableKey, id);

        // finally set the data
        database.setValueForKey(fieldIdTableKey, val);
    }

    /**
     * @dev we are essentially claiming this [id].[table] for the msg.sender, and setting the id createdDate
     */
    function _setRowOwner(bytes32 idTableKey) internal {

        require(database.containsKey(idTableKey) == false, "row already has owner");

        uint256 rowMetadata;

        uint16 year = dateTime.getYear(now);
        uint8 month = dateTime.getMonth(now);
        uint8 day = dateTime.getDay(now);

        rowMetadata |= year;
        rowMetadata |= uint256(month)<<16;
        rowMetadata |= uint256(day)<<24;

        rowMetadata |= uint256(_msgSender())<<32;

        database.setValueForKey(idTableKey, bytes32(rowMetadata));
    }

    function _getRowOwner(bytes32 idTableKey) internal returns (address rowOwner, bytes4 createdDate){

        uint256 rowMetadata = uint256(database.getBytes32ForKey(idTableKey));

        createdDate = bytes4(uint32(rowMetadata));
        rowOwner = address(rowMetadata>>32);

    }

    function getRowOwner(bytes32 idTableKey) public returns (address rowOwner, bytes4 createdDate){
        return _getRowOwner(idTableKey);
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
                // rowMetaData is packed as address (bytes20) + createdDate (bytes4)
                bytes32 rowMetaData = database.getBytes32ForKey(idTableKey);
                address rowOwner = address(uint256(rowMetaData)>>32);
                require(rowOwner == _msgSender(), "Sender not owner of row");
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
        increaseGsnCounter();

        // set data (overwrite)
        database.setValueForKey(fieldIdTableKey, bytes32(val));

    }

    modifier deleteCheck(bytes32 tableKey, bytes32 idTableKey, bytes32 idKey, bytes32 id) {

        require(table.containsValueForKey(tableKey, id) == true, "id doesn't exist");

        (uint256 permission, address delegate) = getTableMetadata(tableKey);

        // if permission = 0, system table we can't do anything
        require(permission > 0, "Cannot DELETE from system table");

        // if permission = 1, we must be the owner/delegate
        require(permission > 1 || isOwner() == true || delegate == _msgSender(), "Only owner/delegate can DELETE from this table");

        // permissions check, is the idTableKey a subhash of the id and table?
        require(isNamehashSubOf(idKey, tableKey, idTableKey) == true, "idTableKey not a subhash [id].[table]");

        // permissions check (public table = 2, shared table = 3),
        // if 2 or 3 is the _msg.sender() the row owner? But if 3 owner() is always allowed
        if (permission >= 2) {
            if (isOwner() || delegate == _msgSender()){
                // pass
            } else {
                // rowMetaData is packed as address (bytes20) + createdDate (bytes4)
                bytes32 rowMetaData = database.getBytes32ForKey(idTableKey);
                address rowOwner = address(uint256(rowMetaData)>>32);
                require(rowOwner == _msgSender(), "Sender not owner of row");
            }
        }

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

        // increment counter
        increaseGsnCounter();

        // remove the key
        bool removed = database.removeKey(fieldIdTableKey);

        require(removed == true, "error removing key");

        // TODO: zero out the data? Why bother everything is public

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

    // TODO: improve this, we don't want to cause data consistency if the client doesn't call this
    // Right now we manually call this, but ideally we iterate over all the data and delete each column
    // but this would require decoding and having all the field names
    function deleteRow(

        bytes32 tableKey,
        bytes32 idTableKey,

        bytes32 idKey,
        bytes32 id

    ) public deleteCheck(tableKey, idTableKey, idKey, id){

        // increment counter
        increaseGsnCounter();

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

    /*
    function getAllDataKeys() external view returns (bytes32[] memory) {
        return database.enumerate();
    }
    */

    function checkDataKey(bytes32 key) external view returns (bool) {
        return database.containsKey(key);
    }

    /**
     * @dev all data is public, so no need for security checks, we leave the data type handling to the client
     */
    function getRowValue(bytes32 fieldIdTableKey) external view returns (bytes32) {

        if (database.containsKey(fieldIdTableKey)) {
            return database.getBytes32ForKey(fieldIdTableKey);
        } else {
            return bytes32(0);
        }
    }

    function getRowValueVar(bytes32 fieldIdTableKey) external view returns (bytes memory) {

        if (database.containsKey(fieldIdTableKey)) {
            return database.getBytesForKey(fieldIdTableKey);
        } else {
            return new bytes(0);
        }
    }

    /**
     * @dev Warning this produces an Error: overflow (operation="setValue", fault="overflow", details="Number can only safely store up to 53 bits")
     *      if the table doesn't exist
     */
    function getTableIds(bytes32 tableKey) external view returns (bytes32[] memory){

        require(table.containsKey(tableKey) == true, "table not created");

        return table.enumerateForKey(tableKey);
    }

    function isNamehashSubOf(bytes32 subKey, bytes32 base, bytes32 target) internal pure returns (bool) {

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
        require(_table[_tableKey] > 0, "table does not exist");

        uint256 tableMetadata = uint256(_table[_tableKey]);

        permission = uint256(uint8(tableMetadata));
        delegate = address(tableMetadata>>8);
    }

    function setTableMetadata(bytes32 _tableKey, uint8 permission, address delegate) private onlyOwner {
        uint256 tableMetadata;

        tableMetadata |= permission;
        tableMetadata |= uint160(delegate)<<8;

        _table[_tableKey] = bytes32(tableMetadata);
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

        bytes32 curDateHashed = getGsnCounter();

        // check gsnCounter for today and compare to limit
        uint256 curCounter = gsnCounter[curDateHashed];

        if (curCounter >= gsnMaxCallsPerDay){
            return _rejectRelayedCall(2);
        }


        return _approveRelayedCall();
    }

    function setGsnMaxCallsPerDay(uint256 max) external onlyOwner {
        gsnMaxCallsPerDay = uint40(max);
    }

    /*
    event GsnCounterIncrease (
        address indexed _from,
        bytes4 indexed curDate
    );
    */

    /**
     * Increase the GSN Counter for today
     */
    function increaseGsnCounter() internal {

        bytes32 curDateHashed = getGsnCounter();

        uint256 curCounter = gsnCounter[curDateHashed];

        gsnCounter[curDateHashed] = curCounter + 1;

        // emit GsnCounterIncrease(_msgSender(), bytes4(uint32(curDate)));
    }

    /*
     *
     */
    function getGsnCounter() internal view returns (bytes32 curDateHashed) {

        uint256 curDate;

        uint16 year = dateTime.getYear(now);
        uint8 month = dateTime.getMonth(now);
        uint8 day = dateTime.getDay(now);

        curDate |= year;
        curDate |= uint256(month)<<16;
        curDate |= uint256(day)<<24;

        curDateHashed = keccak256(abi.encodePacked(curDate));
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
