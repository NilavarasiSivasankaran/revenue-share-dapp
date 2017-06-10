const express = require('express')
const router = require('./router')
const intract = require ('./intract')
const app = express()

app.use("/",router);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})