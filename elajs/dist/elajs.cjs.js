'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var strToBytes32 = function strToBytes32(input) {
  var targetBuf = new Buffer.alloc(32);
  var inputBuf = new Buffer.from(input);
  var inputByteLen = inputBuf.byteLength; // overflow isn't written

  inputBuf.copy(targetBuf, inputByteLen < 32 ? 32 - inputByteLen : 0);
  return targetBuf;
};

var bytes32ToStr = function bytes32ToStr(buf) {
  return buf.toString();
};

var uintToBytes32 = function uintToBytes32(input) {
  var inputBuf = new Buffer.alloc(4);
  inputBuf.writeUInt32BE(input);
  var targetBuf = new Buffer.alloc(32);
  inputBuf.copy(targetBuf, 28);
  return targetBuf;
};

var bytes32ToUint = function bytes32ToUint(buf) {
  var buf4 = new Buffer.alloc(4);
  buf.copy(buf4, 0, 28);
  return parseInt(buf4.readUInt32BE().toString(10));
};

exports.bytes32ToStr = bytes32ToStr;
exports.bytes32ToUint = bytes32ToUint;
exports.strToBytes32 = strToBytes32;
exports.uintToBytes32 = uintToBytes32;
