pragma solidity ^0.5.0;

/**
 * @title BytesToTypes
 * @dev The BytesToTypes contract converts the memory byte arrays to the standard solidity types
 * @author pouladzade@gmail.com
 */

library BytesToTypes {
    function toAddress(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (address _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toBool(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (bool _output)
    {
        uint8 x;
        assembly {
            x := mload(add(_input, _offst))
        }
        x == 0 ? _output = false : _output = true;
    }
    function getStringSize(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint256 size)
    {
        assembly {
            size := mload(add(_input, _offst))
            let chunk_count := add(div(size, 32), 1) // chunk_count = size/32 + 1
            if gt(mod(size, 32), 0) {
                // if size%32 > 0
                chunk_count := add(chunk_count, 1)
            }
            size := mul(chunk_count, 32) // first 32 bytes reseves for size in strings
        }
    }
 
    function toString(bytes memory _input, uint256 _offst, bytes memory _output)
        internal
        pure
    {
        uint256 size = 32;
        assembly {
            let chunk_count

            size := mload(add(_input, _offst))
            chunk_count := add(div(size, 32), 1) // chunk_count = size/32 + 1
            if gt(mod(size, 32), 0) {
                chunk_count := add(chunk_count, 1) // chunk_count++
            }
            for {
                let index := 0
            } lt(index, chunk_count) {
                index := add(index, 1)
            } {
                mstore(add(_output, mul(index, 32)), mload(add(_input, _offst)))
                _offst := sub(_offst, 32) // _offst -= 32
            }
        }
    } 

    function toBytes32(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (bytes32 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
            //Bug?
            //mstore(_output , add(_input, _offst))
            //mstore(add(_output,32) , add(add(_input, _offst),32))
        }
    }

    function toInt8(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int8 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt16(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int16 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt24(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int24 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt32(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int32 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt40(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int40 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt48(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int48 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt56(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int56 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt64(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int64 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt72(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int72 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt80(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int80 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt88(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int88 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt96(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int96 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt104(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int104 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt112(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int112 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt120(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int120 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt128(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int128 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt136(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int136 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt144(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int144 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt152(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int152 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt160(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int160 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt168(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int168 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt176(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int176 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt184(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int184 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt192(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int192 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt200(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int200 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt208(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int208 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt216(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int216 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt224(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int224 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt232(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int232 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt240(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int240 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt248(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int248 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toInt256(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (int256 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint8(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint8 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint16(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint16 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint24(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint24 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint32(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint32 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint40(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint40 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint48(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint48 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint56(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint56 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint64(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint64 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint72(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint72 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint80(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint80 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint88(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint88 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint96(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint96 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint104(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint104 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint112(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint112 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint120(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint120 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint128(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint128 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint136(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint136 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint144(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint144 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint152(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint152 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint160(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint160 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint168(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint168 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint176(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint176 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint184(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint184 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint192(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint192 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint200(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint200 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint208(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint208 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint216(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint216 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint224(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint224 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint232(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint232 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint240(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint240 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint248(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint248 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

    function toUint256(bytes memory _input, uint256 _offst)
        internal
        pure
        returns (uint256 _output)
    {
        assembly {
            _output := mload(add(_input, _offst))
        }
    }

}
