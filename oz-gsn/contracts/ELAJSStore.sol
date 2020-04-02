pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/math/SafeMath.sol";

import "./OZ_ELA/OwnableELA.sol";

// we use our own GSN contract because we have a different relay hub address
import "./GSN_ELA/GSNRecipientELA.sol";

contract ELAJSStore is Ownable, GSNRecipientELA {

    using SafeMath for uint256;

    // We won't do any pre or post processing, so leave _preRelayedCall and _postRelayedCall empty
    function _preRelayedCall(bytes memory context) internal returns (bytes32) {
    }

    function _postRelayedCall(bytes memory context, bool, uint256 actualCharge, bytes32) internal {
    }
}
