let Web3 = require('web3')
const bip39 = require('bip39')
let Transaction = require('ethereumjs-tx')
let Promise = require('bluebird')
var HDWalletProvider = require("truffle-hdwallet-provider");
var web3 = new Web3();
var provider;

let cachedGasPrice;

const getGasPrice = (txParams) => {
  return new Promise((resolve, reject) => {
    if (txParams.gasPrice) {
      resolve(txParams.gasPrice);
    } else {
      if (cachedGasPrice) {
        resolve(cachedGasPrice);
      } else {
        Promise.promisify(web3.eth.getGasPrice)()
        .then((gasPrice) => {
          cachedGasPrice = '0x' + gasPrice.toString(16);
          resolve(cachedGasPrice);
        })
        .catch((err) => {
          reject(err);
        })
      }
    }
  });
}

const getTxReceipt = (hash) => {
  var getReceipt = Promise.promisify(web3.eth.getTransactionReceipt);
  return new Promise((resolve, reject) => {
    var interval = setInterval(() => {
      //console.log('tx hash: ' + hash);
      getReceipt(hash)
      .then(receipt => {
        if (receipt != null) {
          clearInterval(interval);
          resolve(receipt);
        } else {
          //console.log('Waiting for the transaction to be mined...');
        }
      })
      .catch(err => reject(err))
    }, 500);
  })
}

function newAddress() {
    var mnemonic = bip39.generateMnemonic();
    provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/g3C599IuuA5AvDKXouGd");
    var wallet = { mnemonic: provider.mnemonic,
                    walletAddress: provider.address}
    return new Promise((resolve,reject)=>{
      resolve( wallet )
    }).catch(err=>{
      console.log(err)
    })
}

module.exports = newAddress