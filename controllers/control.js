module.exports = (app, con, urlencodedParser, session) => {

    var MemoryStore = session.MemoryStore;

    app.use(session({
        name : 'app.sid',
        secret: "1234567890QWERTY",
        resave: true,
        store: new MemoryStore(),
        saveUninitialized: true
    }))

    app.get('/',(req,res) => {
        console.log("Get Request @ -> " + req.url);
        if(req.session.user){
            res.render('index', {user: true})
        }
        else{
            res.render('index', {user: false})
        }
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
    //provider Profile
    app.get('/providerProfile', (req, res) => {
        console.log("Get Request @ -> " + req.url)
        console.log('this is referer -> ' + req.headers.referer)
        let id = req.query.id
        let qs = "SELECT * FROM user WHERE id=" + id
        con.query(qs, (err, results) => {
            if(err) throw err;
            console.log(results);
        })
        setTimeout(() => {
            res.redirect(req.headers.referer)
        }, 50)
    })

    //search
    app.get('/search',urlencodedParser, (req,res) => {
        let rows;
        console.log("GET Request @ -> " + req.url)
        let qs = req.query.search
        let query = "SELECT * FROM user where firstName LIKE \'%" + qs +"%\' or lastName LIKE \'%" + qs + "%\'"
        try{
            con.query(query, (err, results) => {
                if (err) throw err
                rows = results
                // console.log(results)
            })
        }
        catch(e){
            console.log(e)
        }

        setTimeout(() => {
            if(req.session.user){
                console.log(rows)
                console.log("after login")
                res.render('search', {user: true, rows: rows, l: rows.length})
            }
            else{
                console.log(rows)
                console.log("before login")
                res.render('search', {user: false, rows: rows, l: rows.length})
            }
        },100)
    })

    
    //login post request
    app.post('/login',urlencodedParser, (req,res) => {
        console.log("Post Request @ -> " + req.url);
        console.log('Username -> ' + req.body.email)
        console.log('Password -> ' + req.body.password)
        let clientUser='', clientPassword=''
        let flag = 1
        try{
            con.query("SELECT * FROM user where email='"+req.body.email+"' and password='"+req.body.password+"'", 
            function (err, result, fields) {
                if (err) {
                    console.error(err)
                }
                if(flag){
                    console.log("Results are => ")
                    console.log(result + " the length is- "+ result.length)
                    // if(result.length == 0){
                    //     res.redirect('invalidLogin')
                    // }
                    if(result.length != 0){
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
                        flag = 0
                    }
                    // console.log("Fields are => ")
                    // console.log(fields)
                    // console.log("2Password is same " + req.session.user)
                }
            })
        setTimeout(() => {
            console.log('flag is : ' + flag)
            if(flag == 0){
                console.log('redirecting to invalidLogin')
                res.redirect('/invalidLogin')
            }
            else{
                console.log('redirecting to home page')
                res.redirect('/')
            }
        }, 100) 
        }
        catch(e){
            res.redirect('/')
        }
    })  

};