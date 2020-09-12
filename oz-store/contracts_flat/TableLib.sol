pragma solidity ^0.5.0;

import "./BytesToTypes.sol";
import "./TypesToBytes.sol";
import "./SizeOf.sol";
import "./ColumnLib.sol";


library TableLib {
    using BytesToTypes for bytes;
    using TypesToBytes for uint256;
    using TypesToBytes for bytes32;

    using ColumnLib for ColumnLib.Column;
    using ColumnLib for ColumnLib.Column[];
    using ColumnLib for bytes;

    struct Table {
        bytes32 name;
        ColumnLib.Column[] columns;
    }

    uint256 constant SIZE = 32;

    // ****************************** SIZE ******************************
    /**
     * @dev TBD
     * @return TBD
     */
    function size(
        Table memory _table
    ) internal pure returns (uint256) {
        return SIZE + 32 + _table.columns.size(); //Add 32 store columns size
    }

    /**
     * @dev TBD
     * @return TBD
     */
    function size(
        Table[] memory _table
    ) internal pure returns (uint256) {
        //Recursive implementation (slower, fixed size, but standard)
        uint256 sum = 0;
        for (uint256 i = 0; i < _table.length; i++) {
            sum += size(_table[i]);
        }
        return sum;
    }

    // ****************************** CREATE ******************************
    /**
     * @dev TBD
     * @return TBD
     */
    function create(
        bytes32 _name,
        bytes32[] memory _columnName,
        bytes32[] memory _columnDtype
    ) internal pure returns (Table memory) {
        require(_columnName.length == _columnDtype.length, "Error alignment.");
        Table memory table;
        table.name = _name;
        table.columns = ColumnLib.createMany(_columnName,_columnDtype);
        return table;
    }

    /**
     * @dev TBD
     * @return TBD
     */
    function encode(Table memory table) internal pure returns (bytes memory) {
        uint256 offset = size(table);
        bytes memory data = new bytes(offset);
        //Name
        table.name.toBytesPacked(offset, data); //Only adds data, no length info
        offset -= 32;
        offset = table.columns.encodeMany(offset, data);

        require(offset == 0, "Encoding Error: offset != 0.");
        return data;
    }

    // ****************************** DECODE ******************************
    function decodeTable(bytes memory _bytes)
        internal
        pure
        returns (Table memory)
    {
        uint256 offset = _bytes.length;
        Table memory table;
        table.name = _bytes.toBytes32(offset);
        offset -= 32;
        (table.columns, offset) = _bytes.decodeColumnMany(offset);

        require(offset == 0, "Encoding Error: offset != 0.");
        return table;
    }

    // ****************************** TUPLE ******************************
    /**
     * @dev TBD
     * @return TBD
     */
    function toTuple(Table memory _table)
        internal
        pure
        returns (
            bytes32 _name,
            bytes32[] memory _columnName,
            bytes32[] memory _columnDtype
        ) {

        _name = _table.name;
        (_columnName,_columnDtype) = _table.columns.toTupleMany();

        return (_name, _columnName, _columnDtype);
    }

}
