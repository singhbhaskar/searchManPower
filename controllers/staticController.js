module.exports = (app, con, urlencodedParser) => {
    app.get('/',(req,res) => {
        console.log("Get Request @ -> " + req.url);
        res.render('index', {id: 'some'})
    })
    

    app.get('/invalidLogin',(req,res) => {
        console.log("Get Request @ -> " + req.url);
        if(req.headers.referer == undefined){
            res.redirect('/')
        }
        else{
            let mess = "invalide credentials"
            res.render('invalidlogin', {msg: mess})
        }
    })

    app.get('/signup',(req,res) => {
        console.log("Get Request @ -> " + req.url);
        res.render('signup')
    })

    app.get('/login', (req,res) => {
        console.log("Get Request @ -> " + req.url);
        console.log('this is referer' + req.headers.referer)
        res.render('login')
    })

    //signUp new user
    app.post('/signup', urlencodedParser,  (req,res) => {
        console.log("Post Request @ -> " + req.url);
        console.log(req.body)
        let body = req.body
        let first = body.first_name
        let last = body.last_name
        let email = body.email
        let pass = body.password
        let dob = body.dob
        let gender = body.gender
        let status = body.status

        let query = "INSERT INTO user VALUES (null,?, ?, ?, ?, ?, ?, ?);"
        let data = [first, last, email, pass, dob, gender, status];
        con.query(query, data, (err, result) => {
            if (err) throw err
            console.log("insert success fully the records", result, "end of insert query")
        })

        setTimeout(() => {
            res.redirect('/')
        }, 100)
    })
};