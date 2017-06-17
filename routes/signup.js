const fs = require('fs');
const bip39 = require('bip39');
const mongojs  = require('mongojs');
const wallet = require('ethereumjs-wallet');
const hdkey = require('ethereumjs-wallet/hdkey');
var Promise = require('bluebird');
var bcrypt = require('bcrypt');

const users = require('../data/store.json');

const config = require('./config.js');
const web3 = require('./web3provider');
const mongoConfig= config.mongoConfig;

const hsmdb    = mongojs('hsm', ['walletStore']);
const normaldb    = mongojs(mongoConfig.dbConnectionString, mongoConfig.dbCollections);

var hashFunc = Promise.promisify(bcrypt.hash);
var fileWrite = Promise.promisify(fs.writeFile);
var readFile = Promise.promisify(fs.readFile);
var append = Promise.promisify(fs.appendFile);
var find = Promise.promisify(normaldb.userStore.find)

function addUser(user,callback){
return new Promise((resolve,reject)=>{
        normaldb.userStore.find({"_id":user.emailAddress},(err,res)=>{
            if(err)
                reject(err)
            else{
                if(res.length==0){
                    let wallet = null;
                    user._id = user.emailAddress;
                    wallet =  newAddress( user.password, user.username )
                    hsmdb.walletStore.insert({_id: wallet.address, wallet});
                    user.walletAddress = wallet.address;
                    users.push(user)
                    return fileWrite('./data/store.json', JSON.stringify(users))
                            .then((hash )=>{
                                    //console.log("inserted")
                                    //user.password = hash;
                                    normaldb.userStore.insert(user);
                                    return Promise.promisify(web3.eth.getAccounts)();
                                })
                            .then(accounts => {
                                var tx = {
                                    from: accounts[0],
                                    gas: 22000,
                                    to: '0x'+wallet.address,
                                    value: web3.toWei(5, "Ether")
                                };
                                console.log(2)
                                return Promise.promisify(web3.eth.sendTransaction)(tx)
                            }).then(hash => resolve(hash))
                    }else{
                        console.log("User Already exist")
                        return "exist"
                        reject();
                    } 
            }
        })
    }) 
}


function newAddress( password, username ) {
  var mnemonic = bip39.generateMnemonic();
  var prewallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic));
  var path = "m/44'/60'/0'/0/0";
  var wallet = prewallet.derivePath(path).getWallet();
  var address = wallet.getAddress().toString("hex");
  var json = wallet.toV3(password);
  console.log(json);
  return json

}

function login(user,callback){
    return new Promise((resolve,reject)=>{
            normaldb.userStore.find({"name":user.name,"password":user.password},(err,res)=>{
                //console.log(res);
                if(res.length==0){
                    reject("Error")
                    console.log("please sign up");
                }else{
                    resolve(res)
                    console.log("succesfully logged in");
                }
            })
        })
}
exports.addUser = addUser;
exports.login = login;