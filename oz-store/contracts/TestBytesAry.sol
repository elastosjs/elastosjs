pragma solidity ^0.5.0;

import "./ozEla/OwnableELA.sol";
import "./gsnEla/GSNRecipientELA.sol";
import "./gsnEla/IRelayHubELA.sol";

contract TestBytesAry is OwnableELA, GSNRecipientELA {

    mapping(bytes32 => bytes32) public store;

    function addValues(
        bytes32 tableKey,
        bytes32 idTableKey,

        bytes32 idKey,
        bytes32 fieldKey,

        bytes32 id,
        bytes32[] memory keys,
        bytes32[] memory values
    ) public {

        require(keys.length == values.length, "keys, values array length mismatch");

        uint8 len = uint8(keys.length);

        for (uint8 i = 0; i < len; i++) {
            store[keys[i]] = values[i];
        }
    }

    // ************************************* SETUP FUNCTIONS *************************************
    function initialize() public initializer {
        OwnableELA.initialize(msg.sender);
        GSNRecipientELA.initialize();
    }

    function _initialize() internal {

    }

    /**
     * As a first layer of defense we employ a max number of checks per day
     */
    function acceptRelayedCall(
        address relay,
        address from,
        bytes calldata encodedFunction,
        uint256 transactionFee,
        uint256 gasPrice,
        uint256 gasLimit,
        uint256 nonce,
        bytes calldata approvalData,
        uint256 maxPossibleCharge
    ) external view returns (uint256, bytes memory) {

        // TODO: check gsnCounter and compare to limit

        return _approveRelayedCall();
    }

    // We won't do any pre or post processing, so leave _preRelayedCall and _postRelayedCall empty
    function _preRelayedCall(bytes memory context) internal returns (bytes32) {
    }

    function _postRelayedCall(bytes memory context, bool, uint256 actualCharge, bytes32) internal {
    }

    /**
     * @dev Withdraw a specific amount of the GSNReceipient funds
     * @param amt Amount of wei to withdraw
     * @param dest This is the arbitrary withdrawal destination address
     */
    function withdraw(uint256 amt, address payable dest) public onlyOwner {
        IRelayHubELA relayHub = getRelayHub();
        relayHub.withdraw(amt, dest);
    }

    /**
     * @dev Withdraw all the GSNReceipient funds
     * @param dest This is the arbitrary withdrawal destination address
     */
    function withdrawAll(address payable dest) public onlyOwner returns (uint256) {
        IRelayHubELA relayHub = getRelayHub();
        uint256 balance = getRelayHub().balanceOf(address(this));
        relayHub.withdraw(balance, dest);
        return balance;
    }

    function getGSNBalance() public view returns (uint256) {
        return getRelayHub().balanceOf(address(this));
    }

    function getRelayHub() internal view returns (IRelayHubELA) {
        return IRelayHubELA(_getRelayHub());
    }
}
