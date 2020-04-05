pragma solidity ^0.5.0;

import "sol-datastructs/src/contracts/PolymorphicDictionaryLib.sol";
import "sol-datastructs/src/contracts/Bytes32DictionaryLib.sol";

// import "./oz/EnumerableSetDictionary.sol";

import "./ozEla/OwnableELA.sol";
import "./gsnEla/GSNRecipientELA.sol";
import "./gsnEla/IRelayHubELA.sol";

contract ELAJSStore is OwnableELA, GSNRecipientELA {

    using PolymorphicDictionaryLib for PolymorphicDictionaryLib.PolymorphicDictionary;
    using Bytes32DictionaryLib for Bytes32DictionaryLib.Bytes32Dictionary;

    uint8 public version;

    // table = Mapping of bytes32 to a PolymorphicDict
    mapping(bytes32 => PolymorphicDictionaryLib.PolymorphicDictionary) table;

    // _table = system table (OneToOneFixed) of each table's metadata marshaled
    // 8 bits - permissions (00 = system, 01 = private, 10 = public, 11 = shared - owner can always edit)
    // 40 bits - autoIncrement (uint40) - 5 bytes = ~1 trillion rows
    // 20 bytes - address delegate - other address allowed to edit, unimplemented (likely implemented as multi-sig address)
    Bytes32DictionaryLib.Bytes32Dictionary private _table;

    function initialize() public initializer {
        OwnableELA.initialize(msg.sender);
        GSNRecipientELA.initialize();
        _initialize();
    }

    function _initialize() internal {

        // test = 0x04f740db81dc36c853ab4205bddd785f46e79ccedca351fc6dfcbd8cc9a33dd6
        setTableMetadata(0x04f740db81dc36c853ab4205bddd785f46e79ccedca351fc6dfcbd8cc9a33dd6, 2, 1, 0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e);
    }

    /*
    function containsKey(bytes32 key) external view returns (bool) {
        return root.containsKey(key);
    }


    function containsKey2() external view returns (bool) {
        return root.containsKey(_tableKey);
    }

    function containsKey3() external view returns (bool) {
        return root.containsKey(0x24fe0be17f2ee45be39dc4c76c3eb2620ec5b3c9a3d673c7271a7d6a8df67fb3);
    }

    function getTableData(bytes32 key) external view returns (uint256){
        return root.getUInt256ForKey(key);
    }
    */

    // ************************************* SCHEMA FUNCTIONS *************************************
    function createTable(bytes32 tableKey, uint8 permission) public {

        // check if table exists
        require(_table.containsKey(tableKey) == false, "Table already exists");

        uint40 autoIncrement = 1;
        address delegate = 0x0;

        // first set the metadata
        setTableMetadata(tableKey, permission, autoIncrement, delegate);

        //
    }

    // ************************************* CRUD FUNCTIONS *************************************

    /**
     * Prior to insert, we check the permissions, if it's good then we return the autoIncrement
     * and then increment it
     */
    function preInsert(bytes32 tableKey) {

        (uint8 permission, uint40 autoIncrement, address delegate) = getTableMetadata(tableKey);

        // if permission = 0, system table we can't do anything
        require(permission > 0, "Cannot insert into system table");

        // if permission = 1, we must be the owner
        require(permission == 1 && isOwner() == false, "Only owner can insert into this table");

        setTableMetadata(tableKey, permission, autoIncrement + 1, delegate);

        return autoIncrement;
    }


    // ************************************* _TABLE FUNCTIONS *************************************
    function getTableMetadata(bytes32 _tableKey)
        view
        returns (uint256 permission, uint256 autoIncrement, address delegate)
    {
        uint256 tableMetadata = uint256(_table.getValueForKey(_tableKey));

        permission = uint256(uint8(tableMetadata));
        autoIncrement = uint256(uint40(tableMetadata>>8));
        delegate = address(tableMetadata>>48);
    }

    function setTableMetadata(bytes32 _tableKey, uint8 permission, uint40 autoIncrement, address delegate) public returns (bool) {
        uint256 tableMetadata;

        tableMetadata |= permission;
        tableMetadata |= autoIncrement<<8;
        tableMetadata |= uint160(delegate)<<48;

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
