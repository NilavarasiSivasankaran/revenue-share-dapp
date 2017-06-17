let Web3 = require('web3')
let HookedWeb3Provider = require('hooked-web3-provider')
let Transaction = require('ethereumjs-tx')
let Promise = require('bluebird')

let web3 = new Web3()
web3.setProvider(new Web3.providers.HttpProvider("http://localhost:8545"));

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

web3.invokeTransaction = ( targetFunction, from, walletPwd, ...args) => {
  return new Promise((resolve, reject) => {
    // TODO: check user's password against database
    let checkPwd = true;
    if (!checkPwd) {
      throw new Error('Invalid wallet password');
    }
    targetFunction(...args, {from, walletPwd})
    .then(hash => getTxReceipt(hash))
    .then((receipt) => {
      resolve(receipt.transactionHash)
    })
    .catch((err) => {
      reject(err)
    })
  })
}

module.exports = web3

