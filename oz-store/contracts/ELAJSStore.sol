pragma solidity ^0.5.0;

import "sol-datastructs/src/contracts/PolymorphicDictionaryLib.sol";

import "./OZ_ELA/OwnableELA.sol";
import "./GSN_ELA/GSNRecipientELA.sol";
import "./GSN_ELA/IRelayHubELA.sol";

contract ELAJSStore is OwnableELA, GSNRecipientELA {

    uint8 public version;

    function initialize() public initializer {
        OwnableELA.initialize(msg.sender);
        GSNRecipientELA.initialize();
    }

    function increaseVersion() public {
        version += 1;
    }

    function() external payable {}

    // ************************************* GSN FUNCTIONS *************************************

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

    function getRelayHub() internal view returns (IRelayHubELA) {
        return IRelayHubELA(_getRelayHub());
    }
}
