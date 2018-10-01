var express = require('express')
var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var mysql = require('mysql')

var urlencodedParser = bodyParser.urlencoded({ extended: false })  
app.set('view engine','ejs')
app.use('/assets',express.static('assets')) //describing the static files folder
// app.use(express.static( path.join(__dirname, 'public')));
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database:"test"
  })

  con.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!")
  })


app.get('/',(req,res) => {
    console.log("Request @ -> " + req.url);
    res.render('index')
})

app.post('/signup',urlencodedParser, (req,res) => {
    console.log("Request @ -> " + req.url);
    console.log('Username -> ' + req.body.username)
    console.log('Password -> ' + req.body.password)
    con.query("SELECT * FROM user", function (err, result, fields) {
        if (err) throw err
        console.log("Results are => ")
        console.log(result)
        if(result[0].email === req.body.username){
            console.log("Username is same")
            if(result[0].password === req.body.password)
                console.log("Password is same")
            else
                console.log("Password is different")
        }
        else
        console.log("Username is different")
        // console.log("Fields are => ")
        // console.log(fields)
      });
    res.redirect('/')
})

app.listen(3000)
console.log('Listening at port 3000')