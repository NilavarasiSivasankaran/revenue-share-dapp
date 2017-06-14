const express = require('express')
var router = express.Router();

var revToContract1= require('./interact.js');

router.use(function(req,res,next) {
  console.log('Starting...');
  next();
});


router.get("/",function(req,res){
  res.render('index');
});

router.get("/revTransfer/:v1/:v2/:mnemonic",(req,res)=>{
	revToContract1(req.params.v1,req.params.v2, req.params.mnemonic)
	.then((result)=>{
		if(result){
			res.send({ data:"success",status:200 })
		}
		else
			return "error"
	})
})


module.exports = router;