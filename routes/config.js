var Web3 = require('web3');
var HDWalletProvider = require("truffle-hdwallet-provider");
var web3 = new Web3();
var provider;
var config = {};

function getMnemonic(){
	
		mnemonic="yellow coach begin suggest govern credit primary anxiety tuition churn cherry oval";
		provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/g3C599IuuA5AvDKXouGd");
		web3.setProvider(provider);
		return {
			web3,
			provider
		}
	
		console.log(err)
		return err
	
} 



config.dbConnectionString = 'landstream'
config.dbCollections = ['userStore']
config.apiServerAddress = 'http://localhost:4000'
config.blockchainNodeIP = 'localhost'
config.blockchainNodePort = '8545'
config.blockchainNodeAddress = 'http://localhost:8545'
getMnemonic();
exports.mongoConfig = config;
exports.getMnemonic = getMnemonic;   