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
    console.log("Get Request @ -> " + req.url);
    res.render('index')
})

app.get('/signup',(req,res) => {
    console.log("Get Request @ -> " + req.url);
    res.render('signup')
})

app.post('/signup', urlencodedParser,  (req,res) => {
    console.log("Post Request @ -> " + req.url);
    console.log(req.body)
    res.redirect('/signup')
})

app.get('/login', (req,res) => {
    console.log("Get Request @ -> " + req.url);
    res.render('login')
})

app.post('/login',urlencodedParser, (req,res) => {
    console.log("Post Request @ -> " + req.url);
    console.log('Username -> ' + req.body.email)
    console.log('Password -> ' + req.body.password)
    con.query("SELECT * FROM user where email='"+req.body.email+"' and password='"+req.body.password+"'", function (err, result, fields) {
        if (err) throw err
        console.log("Results are => ")
        console.log(result)
        if(result[0].email === req.body.email){
            console.log("Email is same")
            if(result[0].password === req.body.password)
                console.log("Password is same")
            else
                console.log("Password is different")
        }
        else
        console.log("Email is different")
        // console.log("Fields are => ")
        // console.log(fields)
      })
    res.redirect('/login')
})

app.listen(3000)
console.log('Listening at port 3000');