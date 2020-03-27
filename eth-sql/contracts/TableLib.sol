pragma solidity ^0.5.0;

import "./SerialityLib/BytesToTypes.sol";
import "./SerialityLib/TypesToBytes.sol";
import "./SerialityLib/SizeOf.sol";
 
library TableLib {
    using BytesToTypes for bytes;
    using SizeOf for string;
    using TypesToBytes for string;
    using TypesToBytes for uint256;
    using TypesToBytes for int256;
    using TypesToBytes for bytes32;

    event EncodeTable(bytes32 indexed _name, bytes _data);
    event LogUInt(uint256 _number);

    struct Table {
        bytes32 name;
        Column[] columns;
        Constraint[] constraints;
        Index[] indexes;
    }

    struct Column {
        bytes32 name;
        bytes32 _dtype;
    }

    struct Constraint {
        bytes32 name;
        bytes32 _type;
    }

    struct Index {
        bytes32 name;
    }

    //WARNING Encoding/Decoding incorrect
    // Use mstore(add(_output, _offst), _input)
    function encode(Table memory _table) internal pure returns (bytes memory) {
        uint256 bufferWords = 1 + 3 + 2 * _table.columns.length + 2 * _table.constraints.length + _table.indexes.length;
        uint256 offset = 32 * bufferWords;
        bytes memory data = new bytes(offset);
        //Name
        _table.name.toBytes(offset, data);
        offset -= 32;

        //Columns
        (_table.columns.length * 64).toBytes(offset, data);
        offset -= 32;
        for (uint256 i = 0; i < _table.columns.length; i++) {
            _table.columns[i].name.toBytes(offset, data);
            offset -= 32;
            _table.columns[i]._dtype.toBytes(offset, data);
            offset -= 32;
        }
        // Constraints
        (_table.constraints.length * 64).toBytes(offset, data);
        offset -= 32;
        for (uint256 i = 0; i < _table.constraints.length; i++) {
            _table.constraints[i].name.toBytes(offset, data);
            offset -= 32;
            _table.constraints[i]._type.toBytes(offset, data);
            offset -= 32;
        }
        // Indexes
        (_table.indexes.length * 32).toBytes(offset, data);
        offset -= 32;
        for (uint256 i = 0; i < _table.indexes.length; i++) {
            _table.indexes[i].name.toBytes(offset, data);
            offset -= 32;
        }

        require (offset == 0, "Encoding Error: offest != 0.");

        return data;
    }

    function decodeTable(bytes memory _bytes) internal pure returns (Table memory) {
        uint256 offset = _bytes.length;
        Table memory _table;
        _table.name = _bytes.toBytes32(offset);
        offset -= 32;

        uint256 columnsLength = _bytes.toUint256(offset) / 64;
        offset -= 32;

        _table.columns = new Column[](columnsLength);       
        for (uint256 i = 0; i < _table.columns.length; i++) {
            Column memory _col;
            _col.name = _bytes.toBytes32(offset);
            offset -= 32;
            _col._dtype = _bytes.toBytes32(offset);
            offset -= 32;
            _table.columns[i] = _col;
        }

        uint256 constraintsLength = _bytes.toUint256(offset) / 64;
        _table.constraints = new Constraint[](constraintsLength);
        offset -= 32;
        for (uint256 i = 0; i < _table.constraints.length; i++) {
            Constraint memory _constraint;
            _constraint.name = _bytes.toBytes32(offset);
            offset -= 32;
            _constraint._type = _bytes.toBytes32(offset);
            offset -= 32;
            _table.constraints[i] = _constraint;
        }

        uint256 indexesLength = _bytes.toUint256(offset) / 32;
        _table.indexes = new Index[](indexesLength);
        offset -= 32;
        for (uint256 i = 0; i < _table.indexes.length; i++) {
            Index memory _index;
            _index.name = _bytes.toBytes32(offset);
            offset -= 32;
            _table.indexes[i] = _index;
        }
        
        require (offset == 0, "Encoding Error: offest != 0.");
        return _table;
    }


    /*
    function encode(Column memory _column) internal pure returns (bytes memory) {
        bytes memory buffer = new bytes(64);
        _column.name.toBytes(64, buffer);
        _column._dtype.toBytes(32, buffer);
        return buffer;
    }

    function encode(Constraint memory _constraint) internal pure returns (bytes memory) {
        bytes memory buffer = new bytes(64);
        _constraint.name.toBytes(0, buffer);
        _constraint._type.toBytes(32, buffer);
        return buffer;
    }

    function encode(Index memory _index) internal pure returns (bytes memory) {
        bytes memory buffer = new bytes(32);
        _index.name.toBytes(32, buffer);
        return buffer;
    }
    */
}