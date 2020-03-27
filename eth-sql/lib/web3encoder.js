class Web3Encoder {
    static encodeData(web3, data, options) {
        if (typeof data === 'string') {
            data  = Web3Encoder.stringBytes32(data);
        } else if (typeof data === 'Buffer') {
            data  = Web3Encoder.bufferBytes32PadLeft(data);
        } else if (typeof data === 'number') {
            data  = Web3Encoder.int256Bytes32(web3, data);
        } else if (typeof data === 'object') {
            const { struct } = options;
            if (!struct) throw new Error(`Requires struct definition for ${data}!`);
            data  = Web3Encoder.structBytes(web3, data, struct);
        } else {
            throw new Error(`Unsupported Type: ${typeof data}!`);
        }

        return data;
    }

    static bufferBytes32PadLeft(buffer) {
        if (buffer.length > 32) { throw new Error('Buffer to large to pad 32bytes!'); } 
        const padding = Buffer.alloc(32 - buffer.length);
        return Buffer.concat([padding, buffer])
    }

    static bufferBytes32PadRight(buffer) {
        if (buffer.length > 32) { throw new Error('Buffer to large to pad 32bytes!'); } 
        const padding = Buffer.alloc(32 - buffer.length);
        return Buffer.concat([buffer, padding])
    }

    static stringBytes32(str) {
        const buffer = Buffer.from(str)
        return '0x' + this.bufferBytes32PadLeft(buffer).toString('hex')
    }

    static uint256Bytes32(web3, num) {
        return web3.eth.abi.encodeParameter('uint256', num);
    }

    static int256Bytes32(web3, num) {
        return web3.eth.abi.encodeParameter('int256', num);
    }

    static structBytes(web3, data, struct) {
        return web3.eth.abi.encodeParameter(struct, data);
    }

    //TBD
    static stringBytes32New(web3, num) {
        return web3.eth.abi.encodeParameter('string', num);
    }

    static bytes32String(web3, data) {
        const str = web3.utils.hexToAscii(data);
         //Remove null
        return str.replace(/\0/g, '');
    }

    static bytes32Number(web3, data) {
        return web3.utils.hexToNumber(data)
    }
}

module.exports = Web3Encoder;
module.exports.Web3Encoder = Web3Encoder;
module.exports.default = Web3Encoder;