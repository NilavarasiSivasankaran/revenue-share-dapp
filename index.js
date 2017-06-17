const express = require('express')
const router = require('./routes/router')
var bodyParser = require('body-parser')

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

app.use("/",router);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})