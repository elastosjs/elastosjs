pragma solidity ^0.5.0;

import "./BytesToTypes.sol";
import "./TypesToBytes.sol";
import "./SizeOf.sol";

library ColumnLib {
    using BytesToTypes for bytes;
    using TypesToBytes for uint256;
    using TypesToBytes for bytes32;

    struct Column {
        bytes32 name;
        bytes32 _dtype;
    }

    uint256 constant SIZE = 64;

    // ****************************** SIZE ******************************
    /**
     * @dev TBD
     * @return TBD
     */
    function size(
        Column[] memory _column
    ) internal pure returns (uint256) {
        return _column.length * SIZE;
    }

    // ****************************** CREATE ******************************
    /**
     * @dev TBD
     * @return TBD
     */
    function create(
        bytes32 _columnName,
        bytes32 _columnDtype
    ) internal pure returns (Column memory) {
        Column memory column;
        column.name = _columnName;
        column._dtype = _columnDtype;
        return column;
    }

    /**
     * @dev TBD
     * @return TBD
     */
    function createMany(
        bytes32[] memory _columnName,
        bytes32[] memory _columnDtype
    ) internal pure returns (Column[] memory) {
        require(_columnName.length == _columnDtype.length, "Error alignment.");

        Column[] memory columns = new Column[](_columnName.length);
        for (uint256 i = 0; i < _columnName.length; i++) {
            Column memory col;
            col.name = _columnName[i];
            col._dtype = _columnDtype[i];
            columns[i] = col;
        }

        return columns;
    }

    // ****************************** ENCODE ******************************
    /**
     * @dev TBD
     * @return TBD
     */
    function encode(Column memory _column) internal pure returns (bytes memory) {
        uint256 offset = SIZE;
        bytes memory data = new bytes(offset);
        _column.name.toBytesPacked(offset, data);
        offset -= 32;
        _column._dtype.toBytesPacked(offset, data);
        offset -= 32;
        require(offset == 0, "Encoding Error: offset != 0.");

        return data;
    }

    /**
     * @dev TBD
     * @return TBD
     */
    function encode(Column memory _column, uint256 offsetStart, bytes memory data) internal pure returns (uint256) {
        uint256 offset = offsetStart;

        _column.name.toBytesPacked(offset, data);
        offset -= 32;
        _column._dtype.toBytesPacked(offset, data);
        offset -= 32;

        return offset;
    }

    /**
     * @dev TBD
     * @return TBD
     */
    function encodeMany(Column[] memory _column) internal pure returns (bytes memory) {
        uint256 offset = size(_column);
        bytes memory data = new bytes(offset);
        for (uint256 i = 0; i < _column.length; i++) {
            _column[i].name.toBytesPacked(offset, data);
            offset -= 32;
            _column[i]._dtype.toBytesPacked(offset, data);
            offset -= 32;
        }
        require(offset == 0, "Encoding Error: offset != 0.");

        return data;
    }

    /**
     * @dev TBD
     * @return TBD
     */
    function encodeMany(Column[] memory _column, uint256 offsetStart, bytes memory data) internal pure returns (uint256) {
        uint256 offset = offsetStart;
        //write length
        size(_column).toBytes(offset, data);
        offset -= 32;
        for (uint256 i = 0; i < _column.length; i++) {
            _column[i].name.toBytesPacked(offset, data);
            offset -= 32;
            _column[i]._dtype.toBytesPacked(offset, data);
            offset -= 32;
        }

        return offset;
    }


    // ****************************** DECODE ******************************
    /**
     * @dev TBD
     * @return TBD
     */
    function decodeColumn(bytes memory _bytes)
        internal
        pure
        returns (Column memory)
    {
        uint256 offset = _bytes.length;
        Column memory column;
        column.name = _bytes.toBytes32(offset);
        offset -= 32;
        column._dtype = _bytes.toBytes32(offset);
        offset -= 32;

        require(offset == 0, "Encoding Error: offset != 0.");
        return column;
    }

    /**
     * @dev TBD
     * @return TBD
     */
    function decodeColumn(bytes memory _bytes, uint256 offsetStart)
        internal
        pure
        returns (Column memory, uint256)
    {
        uint256 offset = offsetStart;
        Column memory column;
        column.name = _bytes.toBytes32(offset);
        offset -= 32;
        column._dtype = _bytes.toBytes32(offset);
        offset -= 32;

        return (column, offset);
    }

    /**
     * @dev TBD
     * @return TBD
     */
    function decodeColumnMany(bytes memory _bytes) internal pure returns (Column[] memory) {
        uint256 offset = _bytes.length;
        uint256 len = offset / SIZE;
        Column[] memory result = new Column[](len);

        for (uint256 i = 0; i < len; i++) {
            Column memory column;
            column.name = _bytes.toBytes32(offset);
            offset -= 32;
            column._dtype = _bytes.toBytes32(offset);
            offset -= 32;
            result[i] = column;
        }

        require(offset == 0, "Encoding Error: offset != 0.");
        return result;
    }

    /**
     * @dev TBD
     * @return TBD
     */
    function decodeColumnMany(bytes memory _bytes, uint256 offsetStart) internal pure returns (Column[] memory, uint256) {
        uint256 offset = offsetStart;
        uint256 bytesLen = _bytes.toUint256(offset);
        offset -= 32;

        uint256 len = bytesLen / SIZE;
        Column[] memory result = new Column[](len);
        for (uint256 i = 0; i < len; i++) {
            Column memory column;
            column.name = _bytes.toBytes32(offset);
            offset -= 32;
            column._dtype = _bytes.toBytes32(offset);
            offset -= 32;
            result[i] = column;
        }

        return (result, offset);
    }


    // ****************************** TUPLE ******************************
    /**
     * @dev TBD
     * @return TBD
     */
    function toTuple(Column memory _column)
        internal
        pure
        returns (
            bytes32 _columnName,
            bytes32 _columnDtype
        ) {
        return (_column.name, _column._dtype);
    }

    /**
     * @dev TBD
     * @return TBD
     */
    function toTupleMany(Column[] memory _column)
        internal
        pure
        returns (
            bytes32[] memory _columnName,
            bytes32[] memory _columnDtype
        ) {

        _columnName = new bytes32[](_column.length);
        _columnDtype = new bytes32[](_column.length);

        for (uint256 i = 0; i < _column.length; i++) {
            (bytes32 name, bytes32 dtype) = toTuple(_column[i]);
            _columnName[i] = name;
            _columnDtype[i] = dtype;
        }

        return (_columnName, _columnDtype);
    }

}
