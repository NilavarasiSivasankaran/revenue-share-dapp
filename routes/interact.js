var Promise = require('bluebird');
var config = require('./config.js');

var RevenueShareContract = require('../abi/RevenueShareContract.js');
let abi = JSON.parse(RevenueShareContract.abi);

var web3, provider;
var getMnemonic = config.getMnemonic;

function getTxReceipt(hash) {
    var getReceipt = Promise.promisify(web3.eth.getTransactionReceipt);
    return new Promise(function (resolve, reject) {
        var interval = setInterval(function () {
            getReceipt(hash)
                .then(function (receipt) {
                    if (receipt != null) {
                        clearInterval(interval);
                        resolve(receipt);
                    } else {
                        console.log('Waiting for the transaction to be mined...');
                    }
                })
                .catch(function (err) {
                    reject(err);
                });
        }, 3000);
    });
}
function revToContract1(vendor1,vendor2,mnemonic){
    var splitRevenue, revToContract, RevenueShareContractObj;
    
    return Promise.resolve(getMnemonic(mnemonic))
        .then((providers)=>{
            web3 = providers.web3;
            provider = providers.provider;
            RevenueShareContractObj = web3.eth.contract(abi).at(RevenueShareContract.address);
            revToContract = Promise.promisify(RevenueShareContractObj.revToContract);
            splitRevenue = Promise.promisify(RevenueShareContractObj.splitRevenue);
            return revToContract({from: provider.address,value:web3.toWei(1, "ether") })
        }).then((hash) => getTxReceipt(hash))
        .then(()=>{
            console.log("Amount has been successfully transfered to the contract")
            return splitRevenue(vendor1,vendor2,{from:provider.address})
        })
        .then((hash)=>getTxReceipt(hash))
        .then(()=>{
            console.log("Successfully split the amount.")
            return true
        }).catch((err)=>{
            console.log(err);
            return false
        })
}

module.exports = revToContract1;