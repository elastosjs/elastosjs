pragma solidity ^0.5.0;

//One-to-One Dictionaries
import "./Bytes32DictionaryLib.sol";
import "./BytesDictionaryLib.sol";
//One-to-Many Dictionaries
import "./Bytes32SetDictionaryLib.sol";
import "./BytesSetDictionaryLib.sol";

/**
Abstracts management of multiple dictionary types.
Avoids key conflicts.
bytes32 => bytes32/bytes/{bytes32}/{bytes}
*/
library PolymorphicDictionaryLib {
    //Bytes32 (Fixed)
    using Bytes32DictionaryLib for Bytes32DictionaryLib.Bytes32Dictionary;
    using Bytes32SetDictionaryLib for Bytes32SetDictionaryLib.Bytes32SetDictionary;
    //Bytes (Variable)
    using BytesDictionaryLib for BytesDictionaryLib.BytesDictionary;
    using BytesSetDictionaryLib for BytesSetDictionaryLib.BytesSetDictionary;

    struct PolymorphicDictionary {
        //One-to-one
        Bytes32DictionaryLib.Bytes32Dictionary OneToOneFixed;
        BytesDictionaryLib.BytesDictionary OneToOneVariable;
        //One-to-many
        Bytes32SetDictionaryLib.Bytes32SetDictionary OneToManyFixed;
        BytesSetDictionaryLib.BytesSetDictionary OneToManyVariable;
    }

    //Switch to Fixed/Var based on value override
    enum DictionaryType { OneToManyFixed, OneToManyVariable, OneToOneFixed, OneToOneVariable }

    //Overrides
    function containsKey(PolymorphicDictionary storage dictionary, bytes32 _key, DictionaryType _type) internal view returns (bool) {
        require(uint8(_type) < 4, "Invalid table type!");

        if (DictionaryType.OneToManyFixed == _type) {
            return dictionary.OneToManyFixed.containsKey(_key); }
        if (DictionaryType.OneToManyVariable == _type) {
            return dictionary.OneToManyVariable.containsKey(_key); }
        if (DictionaryType.OneToOneFixed == _type) {
            return dictionary.OneToOneFixed.containsKey(_key); }
        if (DictionaryType.OneToOneVariable == _type) {
            return dictionary.OneToOneVariable.containsKey(_key); }
    }

    // Read
    // Enumerate
    function enumerate(PolymorphicDictionary storage dictionary) internal view returns (bytes32[] memory) {
        bytes32[] memory keys0 = enumerate(dictionary, DictionaryType.OneToOneFixed);
        bytes32[] memory keys1 = enumerate(dictionary, DictionaryType.OneToOneVariable);
        bytes32[] memory keys2 = enumerate(dictionary, DictionaryType.OneToManyFixed);
        bytes32[] memory keys3 = enumerate(dictionary, DictionaryType.OneToManyVariable);
        bytes32[] memory keysAll = new bytes32[](keys0.length + keys1.length + keys2.length + keys3.length);
        uint256 idx = 0;
        for (uint256 i = 0; i < keys0.length; i++) {
            keysAll[idx] = keys0[i];
            idx++;
        }
        for (uint256 i = 0; i < keys1.length; i++) {
            keysAll[idx] = keys1[i];
            idx++;
        }
        for (uint256 i = 0; i < keys2.length; i++) {
            keysAll[idx] = keys2[i];
            idx++;
        }
        for (uint256 i = 0; i < keys3.length; i++) {
            keysAll[idx] = keys3[i];
            idx++;
        }
    }

    function enumerate(PolymorphicDictionary storage dictionary, DictionaryType _type) internal view returns (bytes32[] memory) {
        require(uint8(_type) < 4, "Invalid table type!");

        if (DictionaryType.OneToManyFixed == _type) {
            return dictionary.OneToManyFixed.enumerateKeys(); }
        if (DictionaryType.OneToManyVariable == _type) {
            return dictionary.OneToManyVariable.enumerateKeys(); }
        if (DictionaryType.OneToOneFixed == _type) {
            return dictionary.OneToOneFixed.enumerateKeys(); }
        if (DictionaryType.OneToOneVariable == _type) {
            return dictionary.OneToOneVariable.enumerateKeys(); }
    }

    function enumerateForKeyOneToManyFixed(PolymorphicDictionary storage dictionary, bytes32 _key) internal view returns (bytes32[] memory) {
        return dictionary.OneToManyFixed.enumerateForKey(_key);
    }

    function enumerateForKeyOneToManyVariable(PolymorphicDictionary storage dictionary, bytes32 _key) internal view returns (bytes[] memory) {
        return dictionary.OneToManyVariable.enumerateForKey(_key);
    }

    // Contains
    function containsKey(PolymorphicDictionary storage dictionary, bytes32 _key) internal view returns (bool) {
        return dictionary.OneToOneFixed.containsKey(_key) ||
        dictionary.OneToOneVariable.containsKey(_key) ||
        dictionary.OneToManyFixed.containsKey(_key) ||
        dictionary.OneToManyVariable.containsKey(_key);
    }

    function containsValueForKey(PolymorphicDictionary storage dictionary, bytes32 _key, bytes32 _value) internal view returns (bool) {
        return dictionary.OneToManyFixed.containsValueForKey(_key, _value);
    }

    function containsValueForKey(PolymorphicDictionary storage dictionary, bytes32 _key, bytes memory _value) internal view returns (bool) {
        return dictionary.OneToManyVariable.containsValueForKey(_key, _value);
    }

    // Length
    function length(PolymorphicDictionary storage dictionary) internal view returns (uint256) {
        return dictionary.OneToOneFixed.length() +
        dictionary.OneToOneVariable.length() +
        dictionary.OneToManyFixed.length() +
        dictionary.OneToManyVariable.length();
    }

    function lengthForKey(PolymorphicDictionary storage dictionary, bytes32 _key) internal view returns (uint256) {
        return dictionary.OneToManyFixed.lengthForKey(_key) +
        dictionary.OneToManyVariable.lengthForKey(_key);
    }

    // Get
    function getBytes32ForKey(PolymorphicDictionary storage dictionary, bytes32 key) internal view returns (bytes32) {
        return dictionary.OneToOneFixed.getValueForKey(key);
    }

    function getBytesForKey(PolymorphicDictionary storage dictionary, bytes32 key) internal view returns (bytes memory) {
        return dictionary.OneToOneVariable.getValueForKey(key);
    }

    function getBytes32SetForKey(PolymorphicDictionary storage dictionary, bytes32 key)
        internal view returns (Bytes32SetLib.Bytes32Set storage) {
        return dictionary.OneToManyFixed.getValueForKey(key);
    }

    function getBytesSetForKey(PolymorphicDictionary storage dictionary, bytes32 key)
        internal view returns (BytesSetLib.BytesSet storage) {
        return dictionary.OneToManyVariable.getValueForKey(key);
    }

    // Write
    // Add/Set
    function setValueForKey(PolymorphicDictionary storage dictionary, bytes32 _key, bytes32 _value) internal returns (bool) {
        require(!dictionary.OneToOneVariable.containsKey(_key), "Error: key exists in other dict.");
        require(!dictionary.OneToManyFixed.containsKey(_key), "Error: key exists in other dict.");
        require(!dictionary.OneToManyVariable.containsKey(_key), "Error: key exists in other dict.");

        return dictionary.OneToOneFixed.setValueForKey(_key, _value);
    }

    function setValueForKey(PolymorphicDictionary storage dictionary, bytes32 _key, bytes memory _value) internal returns (bool) {
        require(!dictionary.OneToOneFixed.containsKey(_key), "Error: key exists in other dict.");
        require(!dictionary.OneToManyFixed.containsKey(_key), "Error: key exists in other dict.");
        require(!dictionary.OneToManyVariable.containsKey(_key), "Error: key exists in other dict.");

        return dictionary.OneToOneVariable.setValueForKey(_key, _value);
    }

    function addValueForKey(PolymorphicDictionary storage dictionary, bytes32 _key, bytes32 _value) internal returns (bool) {
        require(!dictionary.OneToOneFixed.containsKey(_key), "Error: key exists in other dict.");
        require(!dictionary.OneToOneVariable.containsKey(_key), "Error: key exists in other dict.");
        require(!dictionary.OneToManyVariable.containsKey(_key), "Error: key exists in other dict.");

        return dictionary.OneToManyFixed.addValueForKey(_key, _value);
    }

    function addValueForKey(PolymorphicDictionary storage dictionary, bytes32 _key, bytes memory _value) internal returns (bool) {
        require(!dictionary.OneToOneFixed.containsKey(_key), "Error: key exists in other dict.");
        require(!dictionary.OneToOneVariable.containsKey(_key), "Error: key exists in other dict.");
        require(!dictionary.OneToManyFixed.containsKey(_key), "Error: key exists in other dict.");

        return dictionary.OneToManyVariable.addValueForKey(_key, _value);
    }

    function addKey(PolymorphicDictionary storage dictionary, bytes32 _key, DictionaryType _type) internal returns (bool) {
        require(uint8(_type) < 4, "Invalid table type!");
        require(!dictionary.OneToOneFixed.containsKey(_key), "Error: key exists in other dict.");
        require(!dictionary.OneToOneVariable.containsKey(_key), "Error: key exists in other dict.");
        require(!dictionary.OneToManyFixed.containsKey(_key), "Error: key exists in other dict.");
        require(!dictionary.OneToManyVariable.containsKey(_key), "Error: key exists in other dict.");

        if (DictionaryType.OneToManyFixed == _type) {
            return dictionary.OneToManyFixed.addKey(_key); }
        if (DictionaryType.OneToManyVariable == _type) {
            return dictionary.OneToManyVariable.addKey(_key); }
        if (DictionaryType.OneToOneFixed == _type) {
            return dictionary.OneToOneFixed.setValueForKey(_key, 0x0000000000000000000000000000000000000000000000000000000000000000); }
        if (DictionaryType.OneToOneVariable == _type) {
            return dictionary.OneToOneVariable.setValueForKey(_key, new bytes(0)); }
    }

    // Remove/Delete
    function removeKey(PolymorphicDictionary storage dictionary, bytes32 _key) internal returns (bool) {
        return dictionary.OneToOneFixed.removeKey(_key) ||
        dictionary.OneToOneVariable.removeKey(_key) ||
        dictionary.OneToManyFixed.removeKey(_key) ||
        dictionary.OneToManyVariable.removeKey(_key);
    }

    function removeValueForKey(PolymorphicDictionary storage dictionary, bytes32 _key, bytes32 _value) internal returns (bool) {
        return dictionary.OneToManyFixed.removeValueForKey(_key, _value);
    }

    function removeValueForKey(PolymorphicDictionary storage dictionary, bytes32 _key, bytes memory _value) internal returns (bool) {
        return dictionary.OneToManyVariable.removeValueForKey(_key, _value);
    }
}