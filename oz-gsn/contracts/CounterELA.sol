// contracts/CounterELA.sol
pragma solidity ^0.5.0;

import "./OZ_ELA/OwnableELA.sol";
import "./GSN_ELA/GSNRecipientELA.sol";
import "./GSN_ELA/IRelayHubELA.sol";

contract CounterELA is OwnableELA, GSNRecipientELA {
    uint256 public value;

    function initialize() public initializer {
        OwnableELA.initialize(msg.sender);
        GSNRecipientELA.initialize();
    }

    function increase() public {
        value += 4;
    }

    function() external payable {}

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

    // this can withdraw to any "dest" account, but only the owner can initiate it
    function withdraw(uint256 amt, address payable dest) public onlyOwner {
        IRelayHubELA relayHub = getRelayHub();
        relayHub.withdraw(amt, dest);
    }

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

