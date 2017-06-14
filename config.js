var Web3 = require('web3');
var HDWalletProvider = require("truffle-hdwallet-provider");
var web3 = new Web3();
var provider;

function getMnemonic(mnemonic){
	try{
		provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/g3C599IuuA5AvDKXouGd");
		web3.setProvider(provider);
		return {
			web3,
			provider
		}
	}catch(err){
		console.log(err)
		return err
	}
} 

exports.getMnemonic = getMnemonic;   