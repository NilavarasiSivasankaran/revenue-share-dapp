var Web3               = require('web3');
var fs                 = require('fs');
var Promise            = require('bluebird');
var solc               = require('solc');
var web3               = new Web3();
var HDWalletProvider = require("truffle-hdwallet-provider");

var mnemonic = 'mandate height brown toilet ribbon abandon rib payment kingdom audit tongue margin';
var provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/g3C599IuuA5AvDKXouGd");

web3.setProvider(provider);

var FILENAME      = '../contracts/RevenueShareContract.sol';
var CONTRACT_NAME = 'RevenueShareContract';
var ABI_FILENAME  = '../abi/RevenueShareContract.js';

function getTransactionReceipt(hash) {
    var getReceipt = Promise.promisify(web3.eth.getTransactionReceipt);
    return new Promise(function(resolve, reject) {
        var interval = setInterval(function() {
            getReceipt(hash)
            .then(function(receipt) {
                if (receipt != null) {
                    clearInterval(interval);
                    resolve(receipt);
                } else {
                    console.log('Waiting for the transaction to be mined...');
                }
            })
            .catch(function(err) {
                reject(err);
            });
        }, 3000);
    });
}

function compile(contractSource) {
    return new Promise(function(resolve, reject) {
        var sources = {};
        sources[CONTRACT_NAME + '.sol'] = contractSource;
        var data = solc.compile({sources: sources}, 0);
        if (data.errors != null) {
            reject(data.errors);
            return;
        }
        resolve(data);
    });
}

var compiled, abi, code, gasPrice, transaction, receipt;
Promise.promisify(web3.eth.getGasPrice)()
    .then(function(price) {
        gasPrice = '0x' + price.toString(16);
        console.log('gasPrice: ' + gasPrice);
        return Promise.promisify(fs.readFile)(FILENAME, 'utf8') 
    })
        .then(function(data) {
            return compile(data);
        })
            .then(function(compiled) {
                console.log('Contract compiled.');
                abi  = compiled.contracts[CONTRACT_NAME + '.sol:' + CONTRACT_NAME].interface;
                code = compiled.contracts[CONTRACT_NAME + '.sol:' + CONTRACT_NAME].bytecode;
                var from = provider.address;
                console.log('Address:'+ from);
                transaction = {
                    from: from,
                    data: '0x' + code,
                    gas: 4000000,
                };
                return Promise.promisify(web3.eth.estimateGas)(transaction);
            })
                .then(function(estimation) {
                    console.log('Gas estimation: ' + estimation);
                    transaction.gas = estimation + 50000;
                    return Promise.promisify(web3.eth.sendTransaction)(transaction);
                })
                    .then(function(txHash) {
                        console.log('Transaction hash: ' + txHash);
                        return getTransactionReceipt(txHash);
                    })
                        .then(function(rcpt) {
                            receipt = rcpt;
                            console.log('Deployed at: ' + receipt.contractAddress);
                            console.log('blockHash: ' + receipt.blockHash);
                            console.log('blockNumber: ' + receipt.blockNumber);
                            console.log('transactionHash: ' + receipt.transactionHash);
                            console.log('transactionIndex: ' + receipt.transactionIndex);
                            console.log('gasUsed: ' + receipt.gasUsed);
                            return Promise.promisify(web3.eth.getCode)(receipt.contractAddress);
                        })
                            .then(function(code) {
                                console.log('code: '  + code.substring(0, 20) + '...');
                                var toWrite = 
                                    'var abi = \'' + abi.substring(0, abi.length) + 
                                    '\';\nvar address = \'' + receipt.contractAddress + 
                                    '\';\nmodule.exports = {abi: abi, address: address};';
                                return Promise.promisify(fs.writeFile)(ABI_FILENAME, toWrite);
                            })
                                .then(function() {
                                    console.log('Saved data to file: ' + ABI_FILENAME);
                                })
                                    .catch((err)=>{
                                        console.log(err);
                                    });
