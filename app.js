var express = require('express')
// var path = require('path')
var app = express()
var bodyParser = require('body-parser')
var mysql = require('mysql')
var session = require('express-session')
var cookieParser = require('cookie-parser');


var urlencodedParser = bodyParser.urlencoded({ extended: false })  
app.set('view engine','ejs')
app.use('/assets',express.static('assets')) //describing the static files folder
app.use(cookieParser());
var MemoryStore =session.MemoryStore;
app.use(session({
    name : 'app.sid',
    secret: "1234567890QWERTY",
    resave: true,
    store: new MemoryStore(),
    saveUninitialized: true
}))

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

  app.post('/login',urlencodedParser, (req,res) => {
    console.log("Post Request @ -> " + req.url);
    console.log('Username -> ' + req.body.email)
    console.log('Password -> ' + req.body.password)
    let clientUser='', clientPassword=''
    try{
        con.query("SELECT * FROM user where email='"+req.body.email+"' and password='"+req.body.password+"'", 
        function (err, result, fields) {
            let flag = 1 
            if (err) {
                console.error(err)
                flag = 0
            }
            if(flag){
                console.log("Results are => ")
                console.log(result + " the length is- "+ result.length)
                if(result.length == 0){
                    redirect('login')
                }
                if(result.length != undefined){
                    clientUser = result[0].email
                    clientPassword = result[0].password
                    if(clientUser === req.body.email){
                        console.log("Email is same")
                        if(clientPassword === req.body.password){
                            req.session.user = req.body.email
                            console.log("Password is same " + req.session.user)
                            // res.redirect('/protected')
                        }
                        else
                            console.log("Password is different")
                    }
                    else
                    console.log("Email is different")
                }
                else{
                    console.log("Wrong credentials")
                }
                // console.log("Fields are => ")
                // console.log(fields)
                // console.log("2Password is same " + req.session.user)
            }
        })
    }
    catch(e){
        redirect('login')
    }
    setTimeout(function () {
        res.redirect('/protected')
    }, 100)
})  


app.get('/',(req,res) => {
    console.log("Get Request @ -> " + req.url);
    res.render('index', {id: 'some'})
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

app.get('/logout', (req,res) => {
    console.log("Get Request @ -> " + req.url);
    if(req.session.id){
        req.session.destroy()
    }
    res.redirect('/')
})


app.get('/protected', (req,res) => {
    console.log("Get Request @ -> " + req.url)
    if(req.session.user){
        console.log("Loged in success!")
        let tempUser = req.session.user;
        console.log(tempUser)
        res.render('protected', {id: tempUser})
    }else{
        console.log("No login " + req.session.user)
        res.redirect("/")
    }
    
})



app.listen(3000, (err) => {
    if(err)
        console.log(err)
    else
        console.log('Listening at port 3000')
})