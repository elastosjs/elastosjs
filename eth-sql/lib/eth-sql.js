'use strict';

const ORMContract = require('./build/contracts/ORMExternal.json');
const ORMContractAddress = "0x8A2A2AD882B123e27B1d3F9011F7b5F2DEec4cA3";
const namehash = require('eth-ens-namehash');

const Web3Encoder = require('./Web3Encoder')
const { Parser } = require('node-sql-parser');

/**
 * This is the main class, the entry point to eth-sql.
 */
class EthSQL {
    /**
     * Instantiate eth-sql with web3 instance, contract (optional), and account (optional).
     *
     * @example
     * // without contract/account
     * const ethsql = new EthSQL({
     *   web3: web3
     * })
     *
     * // with storage contract and account
     * const ethsql = new EthSQL({
     *   web3: web3,
     *   contract: '0x000000000000000000000000000000000000000000',
     *   account: '0x000000000000000000000000000000000000000000'
     * })
     *
     * @param {object}   [options={}] An object with options.
     * @param {string}   [options.web3=] The web3 instance connected to the Ethereum network.
     * @param {string}   [options.contract=null] The storage contract that tracks relationships.
     * @param {web3.eth.Contract}   [options.web3Contract=null] The web3 storage contract instance.
     * @param {string}   [options.account=null] The account that signs write transactions.
     */
    constructor(options) {

        const { web3, contract, account, web3Contract } = options;

        //#TODO Validate Ethereum addresses
        if (!web3) {
            throw new Error('Web3 instance needs to be supplied to connect to Ethereum Network.');
        }

        this.web3 = web3;
        this.contract = contract || ORMContractAddress;
        this.account = account
        this.parser = new Parser();
        this.web3Contract = web3Contract || new web3.eth.Contract(ORMContract.abi, this.contract);
    }

    async setAccount() {
        if (!this.account) {
            const accounts = await this.web3.eth.getAccounts();
            if (accounts.length < 1) throw new Error('Web3 has no accounts!')
            this.account = accounts[0];
            return this.account;
        } else {
            return this.account;
        }
    }

    /**
     * Returns the ETHSQL contract address.
     *
     * @returns {string} The ETHSQL contract address.
     */
    getContractAddress() {
        return this.contract;
    }

    /**
     * Returns the ETHSQL contract instance.
     *
     * @returns {web3.eth.Contract} The ETHSQL contract instance.
     */
    getContract() {
        return this.web3Contract;
    }

    /**
     * Define a new model, representing a table in the database.
     *
     * The table columns are defined by the object that is given as the second argument. Each key of the object represents a column
     *
     * @param {string} modelName The name of the model. The model will be stored in `ethsql.models` under this name. The table name will be hashed with keccak256() which will be used as the key on the storage contract.
     * @param {object} attributes An object, where each attribute is a column of the table. See {@link Model.init}
     * @param {object} [options] These options are merged with the default define options provided to the EthSQL constructor and passed to Model.init()
     *
     * @see
     * {@link Model.init} for a more comprehensive specification of the `options` and `attributes` objects.
     *
     * @returns {Model} Newly defined model
     *
     * @example
     * ethsql.define('modelName', {
     *   columnA: {
     *       type: EthSQL.BOOLEAN, //Types ignored for now
     *       field: 'column_a'
     *   },
     *   columnB: Sequelize.STRING,
     *   columnC: 'MY VERY OWN COLUMN TYPE'
     * });
     *
     * ethsql.models.modelName // The model will now be available in models under the name given to define
     */
    /*
    async define(modelName, attributes, options = {}) {
        options.modelName = namehash.normalize(modelName);
        options.ethsql = this;

        const model = class extends Model { };

        model.init(attributes, options);

        //Web3 stuff
        const modelNameHash = namehash.hash(options.modelName)
        const tx = await this.web3Contract.methods.addTable(modelNameHash);
        return { model, tx };
    }
    */

    /**
     * Fetch a Model which is already defined
     *
     * @param {string} modelName The name of a model defined with Sequelize.define
     *
     * @throws Will throw an error if the model is not defined (that is, if sequelize#isDefined returns false)
     * @returns {Model} Specified model
     */
    /*
    model(modelName) {
        if (!this.isDefined(modelName)) {
            throw new Error(`${modelName} has not been defined`);
        }

        return this.modelManager.getModel(modelName);
    }
    */

    async sendTx(tx) {
        return tx.send({from: this.account})
    }

    /**
     * Checks whether a model with the given name is defined
     *
     * @param {string} modelName The name of a model defined with Sequelize.define
     *
     * @returns {boolean} Returns true if model is already defined, otherwise false
     */
    async isDefined(modelName) {
        return this.exists(modelName).call();
    }

    async exists(modelName) {
        const modelNameNormalized = namehash.normalize(modelName);
        const modelNameHash = namehash.hash(modelNameNormalized);
        return this.web3Contract.methods.exists(modelNameHash).call();
    }

    async enumerateTables() {
        return this.web3Contract.methods.getTables().call();
    }

    async addTable(modelName) {
        const modelNameNormalized = namehash.normalize(modelName);
        const modelNameHash = namehash.hash(modelNameNormalized);
        return this.sendTx(this.web3Contract.methods.addTable(modelNameHash));
    }
    
    async removeTable(modelName) {
        const modelNameNormalized = namehash.normalize(modelName);
        const modelNameHash = namehash.hash(modelNameNormalized);
        return this.sendTx(this.web3Contract.methods.removeTable(modelNameHash));
    }

    async getTable(modelName) {
        const modelNameNormalized = namehash.normalize(modelName);
        const modelNameHash = namehash.hash(modelNameNormalized);
        return this.web3Contract.methods.getTable(modelNameHash).call();
    }

    async enumerate(modelName) {
        const modelNameNormalized = namehash.normalize(modelName);
        const modelNameHash = namehash.hash(modelNameNormalized);
        return this.web3Contract.methods.enumerate(modelNameHash).call();
    }

    async length(modelName) {
        const modelNameNormalized = namehash.normalize(modelName);
        const modelNameHash = namehash.hash(modelNameNormalized);
        return this.web3Contract.methods.length(modelNameHash).call();
    }

    async add(modelName, rowData) {
        let data = Web3Encoder.encodeData(this.web3, rowData)
        const modelNameNormalized = namehash.normalize(modelName);
        const modelNameHash = namehash.hash(modelNameNormalized);
        const tx = this.web3Contract.methods.add(modelNameHash, data);
        return this.sendTx(tx);
    }

    async remove(modelName, rowData) {
        let data = Web3Encoder.encodeData(this.web3, rowData)
        const modelNameNormalized = namehash.normalize(modelName);
        const modelNameHash = namehash.hash(modelNameNormalized);
        const tx = this.web3Contract.methods.remove(modelNameHash, data);
        return this.sendTx(tx);
    }

    async contains(modelName, rowData) {
        let data = Web3Encoder.encodeData(this.web3, rowData)
        const modelNameNormalized = namehash.normalize(modelName);
        const modelNameHash = namehash.hash(modelNameNormalized);
        return this.web3Contract.methods.contains(modelNameHash, data).call();
    }

    async get(modelName, index) {
        const modelNameNormalized = namehash.normalize(modelName);
        const modelNameHash = namehash.hash(modelNameNormalized);
        return this.web3Contract.methods.get(modelNameHash, index).call();
    }

    async exec(sql) {
        return this.execSQL(sql);
    }

    async execSQL(sql) {
        const ast = this.parser.astify(sql); // mysql sql grammer parsed by default
        return this.execSQLAST(ast);
    }


    async execSQLAST(ast) {
        return ast;
    }
}

module.exports = EthSQL;
module.exports.EthSQL = EthSQL;
module.exports.default = EthSQL;