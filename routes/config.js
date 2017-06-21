var Web3 = require('web3');
var HDWalletProvider = require("truffle-hdwallet-provider");
var web3 = new Web3();
var provider;
var config = {};



function getMnemonic(mnemonic){
		provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/g3C599IuuA5AvDKXouGd");
		web3.setProvider(provider);
		// web3.eth.getBalance(provider.address,(err,res)=>{
		// 	if(!err)
		// 		console.log(res.toNumber())
		// 	else
		// 		console.log(err)
		// })
		return {
			web3,
			provider
		}	
} 

function getBalance(mnemonic)
{
	provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/g3C599IuuA5AvDKXouGd");
		web3.setProvider(provider);
	return new Promise((resolve,reject)=>
		{	
			web3.eth.getBalance(provider.address,(err,res)=>
			{
			if(!err)
				resolve(web3.fromWei(res, "ether") )

			else
				console.log(err)
		})
		
		})
}


config.dbConnectionString = 'test'
config.dbCollections = ['userStore']
config.apiServerAddress = 'http://localhost:4000'
config.blockchainNodeIP = 'localhost'
config.blockchainNodePort = '8545'
config.blockchainNodeAddress = 'http://localhost:8545'
exports.mongoConfig = config;
exports.getMnemonic = getMnemonic;
exports.getBalance = getBalance;   