const express = require('express')
// var path = require('path')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const session = require('express-session')
const cookieParser = require('cookie-parser')

let controller = require("./controllers/control")
let staticController = require("./controllers/staticController")

const urlencodedParser = bodyParser.urlencoded({ extended: false })  
app.set('view engine','ejs')
app.use('/assets',express.static('assets')) //describing the static files folder
app.use(cookieParser());


// app.use(express.static( path.join(__dirname, 'public')));
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database:"test"
})

con.connect(function(err) {
    if (err) throw err;
        console.log("Database Connected!")
})

controller(app, con, urlencodedParser, session)
staticController(app, con, urlencodedParser)

app.listen(3000, (err) => {
    if(err)
        console.log(err)
    else
        console.log('Listening at port 3000')
})