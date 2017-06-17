const express = require('express')
var router = express.Router();
var revToContract1= require('./interact.js');
var signup = require('./signup.js');
var bodyParser=  require("body-parser");
const app = express();
app.use(bodyParser.json());
var user;
router.use(function(req,res,next) {
  console.log('Starting...');
  next();
});

router.get("/",function(req,res){
  res.render('index2');
});

router.get("/index",function(req,res){
	res.render('index')
})

router.post("/userDetails",(req,res)=>{
	user={	"name":req.body.username,
			"emailAddress":req.body.email,
			"password":req.body.password};
	signup.addUser(user)
	  .then((result)=>{
		if(result){
			res.send({ data:"success",status:200 })
		}
		else
			return "error"
	
	})

})


router.post("/loginDetails",(req,res)=>{
	user={"name":req.body.username,"password":req.body.password};
	console.log(user);
	signup.login(user)
	  .then((result)=>{
	  	console.log("router\n",result);
		if(result){
			res.send({ data:result[0]._id	,status:200 });
		}
		else
			return "error"
	
	})

})



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