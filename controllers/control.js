module.exports = (app, con, urlencodedParser, session) => {

    var MemoryStore = session.MemoryStore;

    app.use(session({
        name : 'app.sid',
        secret: "1234567890QWERTY",
        resave: true,
        store: new MemoryStore(),
        saveUninitialized: true
    }))
    
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
                console.log('redirecting to protected')
                res.redirect('/protected')
            }
        }, 100) 
        }
        catch(e){
            res.redirect('login')
        }
    })  

};