'use strict';
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

const EthSQL = require('../../lib/eth-sql');
const Web3Encoder = require('../../lib/Web3Encoder');

const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const web3 = new Web3(new HDWalletProvider(process.env.ROPSTEN_HD_WALLET_MNEMONIC, process.env.ROPSTEN_RPC));
const ethsql = new EthSQL({ web3 });

describe('simpletest', async () => {
    before(async () => {
        const account = await ethsql.setAccount();
    })
    

    //Write Ops
    /*
    it('add a table', async () => {
        const tx = await ethsql.addTable('integers');
        console.log(tx.transactionHash);
    });

    it('add to table', async () => {
        const tx = await ethsql.add('integers', 42);
        console.log(tx.transactionHash);
    });
    */

    //Read Ops    
    it('enumerate all tables', async () => {
        const tx = await ethsql.enumerateTables();
        console.log(tx);
    });
    

    it('enumerate simpletest table', async () => {
        const rows = await ethsql.enumerate('simpletest');
        const parsed = rows.map(r => Web3Encoder.bytes32String(ethsql.web3, r));
        //console.log(rows);
        console.log(parsed);
    });

    it('enumerate integers table', async () => {
        const rows = await ethsql.enumerate('integers');
        const parsed = rows.map(r => Web3Encoder.bytes32Number(ethsql.web3, r));
        //console.log(rows);
        console.log(parsed);
    });

    //SQL
    it("SELECT * FROM integers;", async () => {
        const sql = "SELECT * FROM integers;";
        const ast = await ethsql.exec(sql);
        console.log(ast[0]);
    });


    it("INSERT INTO integers (id, name) VALUES ((1, 'John'), (2, 'Alice'), (3, 'Bob'));", async () => {
        const sql = "INSERT INTO integers (id, name) VALUES ((1, 'John'), (2, 'Alice'), (3, 'Bob'));";
        const ast = await ethsql.exec(sql);
        console.log(ast[0]);
    });
    
});
