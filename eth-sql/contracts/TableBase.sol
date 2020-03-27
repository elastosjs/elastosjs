pragma solidity ^0.5.0;

import "./TableLib.sol";

contract TableBase {
    using TableLib for TableLib.Table;
    using TableLib for bytes;

    function encodeTable(bytes32 _name, bytes32 _colname) public pure returns (bytes memory) {
        TableLib.Table memory _table;
        _table.name = _name;
        TableLib.Column memory _col;
        _col.name = _colname;
        _table.columns = new TableLib.Column[](1);
        _table.columns[0] = _col;
        bytes memory encoded = _table.encode();
        return encoded;
    }

    function decodeTable(bytes memory _bytes) public pure returns (bytes32, bytes32[] memory, bytes32[] memory) {
        TableLib.Table memory _table = _bytes.decodeTable();
        //name = _table.name;
        bytes32[] memory columnNames = new bytes32[](_table.columns.length);
        bytes32[] memory columnDtypes = new bytes32[](_table.columns.length);
        for (uint256 i = 0; i < _table.columns.length; i++) {
            columnNames[i] = _table.columns[0].name;
            columnDtypes[i] = _table.columns[i]._dtype;
        }

        return (_table.name, columnNames, columnDtypes);
    }



    /**
    function decodeTable(bytes memory _bytes) public pure returns (TableLib.Table memory) {
        TableLib.Table memory _table = _bytes.decodeTable();
        //name = _table.name;
        return _table;
    }
     */

}