pragma solidity ^0.5.0;

/**
 * @title Seriality (forked from https://github.com/pouladzade/Seriality)
 * @dev The Seriality contract is the main interface for serializing data using the TypeToBytes, BytesToType and SizeOf
 * @author pouladzade@gmail.com
 */
 
import "./BytesToTypes.sol";
import "./TypesToBytes.sol";
import "./SizeOf.sol";

library Seriality {
    using BytesToTypes for bytes;
    using SizeOf for string;
    using TypesToBytes for string;
    using TypesToBytes for uint256;
    using TypesToBytes for int256;
    using TypesToBytes for bytes32;
}
