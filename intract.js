var Web3 = require('web3');
var Promise = require('bluebird');
var HDWalletProvider = require("truffle-hdwallet-provider");
var RevenueShareContract = require('./abi/RevenueShareContract.js');

var web3 = new Web3();

var mnemonic = 'mandate height brown toilet ribbon abandon rib payment kingdom audit tongue margin';
var provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/g3C599IuuA5AvDKXouGd");

web3.setProvider(provider);

let abi = JSON.parse(RevenueShareContract.abi);
let RevenueShareContractObj = web3.eth.contract(abi).at(RevenueShareContract.address);

var revToContract = Promise.promisify(RevenueShareContractObj.revToContract);
var splitRevenue = Promise.promisify(RevenueShareContractObj.splitRevenue);

revToContract({from: provider.address,value:web3.toWei(1, "ether") }).then((hash) => getTxReceipt(hash))

splitRevenue({from:provider.address}).then((hash)=>getTxReceipt(hash));


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
	splitRevenue();	
})

