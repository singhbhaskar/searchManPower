const express = require('express')
// var path = require('path')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const session = require('express-session')
const cookieParser = require('cookie-parser')

// requiring controller

let controller = require("./controllers/control")
let staticController = require("./controllers/staticController")
let searchController = require("./controllers/searchController")
let consumerLoginController = require("./controllers/consumerLoginController")
let profileController = require("./controllers/profileController")
let consumerOrderController = require("./controllers/consumerOrderController")


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

var MemoryStore = session.MemoryStore;

app.use(session({
    name : 'app.sid',
    secret: "1234567890QWERTY",
    resave: true,
    store: new MemoryStore(),
    saveUninitialized: true
}))

controller(app, con, urlencodedParser)
staticController(app, con, urlencodedParser)
consumerLoginController(app, con, urlencodedParser)
searchController(app, con, urlencodedParser)
profileController(app, con, urlencodedParser)
consumerOrderController(app, con, urlencodedParser)


app.listen(3000, (err) => {
    if(err)
        console.log(err)
    else
        console.log('Listening at port 3000')
})