pragma solidity ^0.5.0;

/**
 * @title SizeOf
 * @dev The SizeOf return the size of the solidity types in byte
 * @author pouladzade@gmail.com
 */

library SizeOf {

    function size(string memory _in) internal pure  returns(uint _size){
        _size = bytes(_in).length / 32;
        if(bytes(_in).length % 32 != 0)
            _size++;

        _size++; // first 32 bytes is reserved for the size of the string
        _size *= 32;
    }

    function sizeOfInt(uint16 _postfix) internal pure  returns(uint _size){

        assembly{
            switch _postfix
                case 8 { _size := 1 }
                case 16 { _size := 2 }
                case 24 { _size := 3 }
                case 32 { _size := 4 }
                case 40 { _size := 5 }
                case 48 { _size := 6 }
                case 56 { _size := 7 }
                case 64 { _size := 8 }
                case 72 { _size := 9 }
                case 80 { _size := 10 }
                case 88 { _size := 11 }
                case 96 { _size := 12 }
                case 104 { _size := 13 }
                case 112 { _size := 14 }
                case 120 { _size := 15 }
                case 128 { _size := 16 }
                case 136 { _size := 17 }
                case 144 { _size := 18 }
                case 152 { _size := 19 }
                case 160 { _size := 20 }
                case 168 { _size := 21 }
                case 176 { _size := 22 }
                case 184 { _size := 23 }
                case 192 { _size := 24 }
                case 200 { _size := 25 }
                case 208 { _size := 26 }
                case 216 { _size := 27 }
                case 224 { _size := 28 }
                case 232 { _size := 29 }
                case 240 { _size := 30 }
                case 248 { _size := 31 }
                case 256 { _size := 32 }
                default  { _size := 32 }
        }

    }
    
    function sizeOfUint(uint16 _postfix) internal pure  returns(uint _size){
        return sizeOfInt(_postfix);
    }

    
    function sizeOfAddress() internal pure  returns(uint8){
        return 20;
    }

    function sizeOfBool() internal pure  returns(uint8){
        return 1;
    }
}
