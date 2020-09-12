pragma solidity ^0.5.0;

import "./EnumerableSet.sol";

library EnumerableSetMapping {
    using EnumerableSet for EnumerableSet.Set;

    struct SetMapping {
        // Position of the value in the `values` array, plus 1 because index 0
        // means a value is not in the setMapping.
        mapping(bytes32 => EnumerableSet.Set) data;
    }

    /**
     * @dev Add a value to a setMapping. O(1).
     * Returns false if the value was already in the setMapping.
     */
    function addValueForKey(SetMapping storage setMapping, bytes32 key, bytes32 value)
        internal
        returns (bool)
    {
        return setMapping.data[key].add(value);
    }

    /**
     * @dev Removes a value from a setMapping. O(1).
     * Returns false if the value was not present in the setMapping.
     */
    function removeValueForKey(SetMapping storage setMapping, bytes32 key, bytes32 value)
        internal
        returns (bool)
    {
        return setMapping.data[key].remove(value);
    }

    /**
     * @dev Returns true if the value is in the setMapping. O(1).
     */
    function containsValueForKey(SetMapping storage setMapping, bytes32 key, bytes32 value)
        internal
        view
        returns (bool)
    {
        return setMapping.data[key].contains(value);
    }

    function getValueForKey(SetMapping storage setMapping, bytes32 key)
        internal
        view
        returns (EnumerableSet.Set storage)
    {
        return setMapping.data[key];
    }

    /**
     * @dev Returns an array with all values in the setMapping. O(N).
     * Note that there are no guarantees on the ordering of values inside the
     * array, and it may change when more values are added or removed.

     * WARNING: This function may run out of gas on large setMappings: use {length} and
     * {get} instead in these cases.
     */
    function enumerateForKey(SetMapping storage setMapping, bytes32 key)
        internal
        view
        returns (bytes32[] memory)
    {
        return setMapping.data[key].enumerate();
    }

    /**
     * @dev Returns the number of elements on the setMapping. O(1).
     */
    function lengthForKey(SetMapping storage setMapping, bytes32 key)
        internal
        view
        returns (uint256)
    {
        return setMapping.data[key].length();
    }

   /** @dev Returns the element stored at position `index` in the setMapping. O(1).
    * Note that there are no guarantees on the ordering of values inside the
    * array, and it may change when more values are added or removed.
    *
    * Requirements:
    *
    * - `index` must be strictly less than {length}.
    */
    function getValueAtIndexForKey(SetMapping storage setMapping, bytes32 key, uint256 index)
        internal
        view
        returns (bytes32)
    {
        return setMapping.data[key].get(index);
    }
}
