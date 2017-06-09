var Web3 = require('web3');
var Promise = require('bluebird');
var HDWalletProvider = require("truffle-hdwallet-provider");
var RevenueShareContract = require('./abi/RevenueShareContract.js');

var web3 = new Web3();

var mnemonic = 'yellow coach begin suggest govern credit primary anxiety tuition churn cherry oval';
var provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/g3C599IuuA5AvDKXouGd");

web3.setProvider(provider);

let abi = JSON.parse(RevenueShareContract.abi);
let RevenueShareContractObj = web3.eth.contract(abi).at(RevenueShareContract.address);

var revToContract = Promise.promisify(RevenueShareContractObj.revToContract);
var splitRevenue = Promise.promisify(RevenueShareContractObj.splitRevenue);

revToContract({from: provider.address,value:web3.toWei(1, "ether") }).then((hash) => getTxReceipt(hash))

splitRevenue({from:provider.address}).then((hash)=>getTxReceipt(hash));
var vendor1="0xA774D5eE6294ab782c1d099F5D5ed7666B3E1767";
var vendor2="0xEb3d454BC0d25A5f7955C2FFe1cD398A2cD159eF";
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

revToContract().then(()=>{
	splitRevenue("vendor1,vendor2");	
})

