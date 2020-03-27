pragma solidity ^0.5.0;

import "./utils/PolymorphicDictionaryLib.sol";

contract ORMBase {
    using PolymorphicDictionaryLib for PolymorphicDictionaryLib.PolymorphicDictionary;
    PolymorphicDictionaryLib.PolymorphicDictionary internal database;

    // Read
    // Enumerate
    function enumerate() external view returns (bytes32[] memory) {
        return database.enumerate();
    }

    function enumerateForKeyOneToManyFixed(bytes32 _key) external view returns (bytes32[] memory) {
        return database.enumerateForKeyOneToManyFixed(_key);
    }

    function enumerateForKeyOneToManyVariable()//bytes32 _key)
        external pure returns (bytes memory) {
        return new bytes(0);
        //return database.enumerateForKeyOneToManyVariable(_key);
    }

    // Contains
    function containsKey(bytes32 _key) external view returns (bool) {
        return database.containsKey(_key);
    }

    function containsValueForKey(bytes32 _key, bytes32 _value) external view returns (bool) {
        return database.containsValueForKey(_key, _value);
    }

    function containsValueForKey(bytes32 _key, bytes calldata _value) external view returns (bool) {
        return database.containsValueForKey(_key, _value);
    }

    // Length
    function length() external view returns (uint256) {
        return database.length();
    }

    function lengthForKey(bytes32 _key) external view returns (uint256) {
        return database.lengthForKey(_key);
    }

    // Get
    function getBytes32ForKey(bytes32 key) external view returns (bytes32) {
        return database.getBytes32ForKey(key);
    }

    function getBytesForKey(bytes32 key) external view returns (bytes memory) {
        return database.getBytesForKey(key);
    }

    function getBytes32SetForKey()//bytes32 key)
        external pure returns (bytes32[] memory) {
        return new bytes32[](0);
        //return database.getBytes32SetForKey(key);
    }

    function getBytesSetForKey()//bytes32 key)
        external pure returns (bytes memory) {
        return new bytes(0);
        //return database.getBytesSetForKey(key);
    }

    // Write
    // Add/Set
    function setValueForKey(bytes32 _key, bytes32 _value) external returns (bool) {
        return database.setValueForKey(_key, _value);
    }

    function setValueForKey(bytes32 _key, bytes calldata _value) external returns (bool) {
        return database.setValueForKey(_key, _value);
    }

    function addValueForKey(bytes32 _key, bytes32 _value) external returns (bool) {
        return database.addValueForKey(_key, _value);
    }

    function addValueForKey(bytes32 _key, bytes calldata _value) external returns (bool) {
        return database.addValueForKey(_key, _value);
    }

    function addKey(bytes32 _key, PolymorphicDictionaryLib.DictionaryType _type) external returns (bool) {
        return database.addKey(_key, _type);
    }

    // Remove/Delete
    function removeKey(bytes32 _key) external returns (bool) {
        return database.removeKey(_key);
    }

    function removeValueForKey(bytes32 _key, bytes32 _value) external returns (bool) {
        return database.removeValueForKey(_key, _value);
    }

    function removeValueForKey(bytes32 _key, bytes calldata _value) external returns (bool) {
        return database.removeValueForKey(_key, _value);
    }
}