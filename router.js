const express = require('express')

var router = express.Router();
var revToContract1= require('./intract.js');
// Router middleware, mentioned it before defining routes.

//intract.revToContract1;
router.use(function(req,res,next) {
  console.log("/" + req.method);
  next();
});

// Provide all routes here, this is for Home page.

router.get("/",function(req,res){
  //res.json({"message" : "Hello World"});
  res.render('index');
});
router.get("/revTransfer/:v1/:v2",(req,res)=>{
	revToContract1(req.params.v1,req.params.v2).then((result)=>{
		if(result)
			res.send({ data:"success",status:200 })
		else
			return "error"
	})
} )


module.exports = router;