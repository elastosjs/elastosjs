pragma solidity ^0.5.0;

/**
 * @title TypesToBytes
 * @dev The TypesToBytes contract converts the standard solidity types to the byte array
 * @author pouladzade@gmail.com
 */

library TypesToBytes {

    function toBytes(address _input, uint _offst, bytes memory _output) internal pure {

        assembly {
            mstore(add(_output, _offst), _input)
        }
    }

    /*
    function toBytes(bytes32 _input, uint _offst, bytes memory _output) internal pure {

        assembly {
            mstore(add(_output, _offst), _input)
            mstore(add(add(_output, _offst),32), add(_input,32))
        }
    }
    */

    function toBytes(bytes32 _input, uint _offst, bytes memory _output) internal pure {

        assembly {
            mstore(add(_output, _offst), _input)
            //mstore(add(add(_output, _offst),32), add(_input,32)) (Packed encoding)
        }
    }
    
    function toBytes(bool _input, uint _offst, bytes memory _output) internal pure {
        uint8 x = _input == false ? 0 : 1;
        assembly {
            mstore(add(_output, _offst), x)
        }
    }
    
    function toBytes(bytes memory _input, uint _offst, bytes memory _output) internal pure {
        uint256 stack_size = _input.length / 32;
        if(_input.length % 32 > 0) stack_size++;
        
        assembly {
            stack_size := add(stack_size,1)//adding because of 32 first bytes memory as the length
            for { let index := 0 } lt(index,stack_size){ index := add(index ,1) } {
                mstore(add(_output, _offst), mload(add(_input,mul(index,32))))
                _offst := sub(_offst , 32)
            }
        }
    }

    function toBytes(int _input, uint _offst, bytes memory  _output) internal pure {

        assembly {
            mstore(add(_output, _offst), _input)
        }
    } 
    
    function toBytes(uint _input, uint _offst, bytes memory _output) internal pure {

        assembly {
            mstore(add(_output, _offst), _input)
        }
    }

}
