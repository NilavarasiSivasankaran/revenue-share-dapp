const fs = require('fs');
const mongojs  = require('mongojs');
const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const users = require('../data/store.json');
const config = require('./config.js');
const create = require('./WalletCreator');
var CryptoJS = require("crypto-js");
const normaldb = mongojs(config.mongoConfig.dbConnectionString, config.mongoConfig.dbCollections);

var hashFunc = Promise.promisify(bcrypt.hash);
var fileWrite = Promise.promisify(fs.writeFile);
var readFile = Promise.promisify(fs.readFile);
var append = Promise.promisify(fs.appendFile);
var plaintext ;

var getBalance = config.getBalance;

function addUser(user){
    var wallet = {};
    return new Promise((resolve,reject)=>{
        normaldb.userStore.find({"_id":user.emailAddress},(err,res)=>{
        if(err){ 
            console.log(err)
            reject(err)
        }
        else if(res.length===0){
            
            user._id = user.emailAddress;
            resolve(
                create() 
                    .then((walletDetail)=>{
                        wallet = walletDetail;
                        mnemonic=CryptoJS.AES.encrypt(walletDetail.mnemonic,'secret key 123').toString();
                        console.log(mnemonic);
                        return mnemonic
                    }).then((cipher)=>{
                        console.log(cipher)
                        wallet.mnemonic = cipher
                        user.wallet = wallet
                        users.push(user)
                        console.log("user:",users)
                        return fileWrite('./data/store1.json', JSON.stringify(users))
                    }).then(()=>hashFunc(user.password,5))
                    .then((hash)=>{
                        user.password = hash
                        normaldb.userStore.insert(user);
                        console.log("succesfully signed up");
                        return true
                    })
            )
            }
            else{
                console.log("User Already exist")
                return err
            }  
        })
    })
}


function login(user,callback){
    
    return new Promise((resolve,reject)=>{
        //console.log(user);
               normaldb.userStore.find({ "_id":user.emailAddress },(err,res)=>{
               // console.log(res);
                if(res!=0)
                    {
                    return bcrypt.compare( user.password, res[0].password.toString() )
                        .then((status)=>{
                            console.log("succesfully logged in");
                            var bytes  = CryptoJS.AES.decrypt(res[0].wallet.mnemonic.toString(), 'secret key 123');
                            plaintext = bytes.toString(CryptoJS.enc.Utf8);
                           return getBalance(plaintext)

                           
                    }) .then(function (res){
                         resolve({plaintext,res});
                    })
                    }
                    else{
                         reject(err)
                        console.log("please sign up");
                    }
                     })
           
        })
     
}

exports.login = login;
exports.addUser = addUser;
