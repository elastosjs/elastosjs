pragma solidity ^0.5.0;

//PolymorphicDictionary
import "./utils/PolymorphicDictionaryLib.sol";
//Table Struct
import "./TableLib.sol";
/**
Abstracts management of tables
*/
library ORMLib {
    //Dictionary
    using PolymorphicDictionaryLib for PolymorphicDictionaryLib.PolymorphicDictionary;
    using TableLib for TableLib.Table;
    using TableLib for bytes;

    //Constants
    //schemas
    bytes32 constant schemas = 0x736368656d617300000000000000000000000000000000000000000000000000;
    //schemas.public
    bytes32 constant schemasPublic = 0x736368656d61732e7075626c6963000000000000000000000000000000000000;
    //schemas.public.tables
    bytes32 constant schemasPublicTables = 0x736368656d61732e7075626c69632e7461626c65730000000000000000000000;
    //schemas.public.indexes
    bytes32 constant schemasPublicIndexes = 0x736368656d61732e7075626c69632e696e646578657300000000000000000000;

    //Other
    function createTable(PolymorphicDictionaryLib.PolymorphicDictionary storage database, TableLib.Table memory _table)
        internal returns (bool) {
        bytes memory encoded = _table.encode();
        bool success = database.addValueForKey(schemasPublicTables, encoded);
        return success;
    }

    function getTable(PolymorphicDictionaryLib.PolymorphicDictionary storage database, bytes32 _name)
        internal view returns (TableLib.Table memory) {
        bytes memory encoded = database.getBytesForKey(_name);
        return encoded.decodeTable();
    }

    function getTableRaw(PolymorphicDictionaryLib.PolymorphicDictionary storage database, bytes32 _name)
        internal view returns (bytes memory) {
        return database.getBytesForKey(_name);
    }

}