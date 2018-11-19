//contains controller for
// logout
// POST login
// invalid Login
// GET signup
// GET login


module.exports = (app, con, urlencodedParser) => {
    //logout
    app.get('/logout', (req,res) => {
        console.log("Get Request @ -> " + req.url);
        if(req.session.id){
            req.session.destroy()
        }
        res.redirect('/')
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
                                req.session.user = result[0].id
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

    //invalid Login
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
    
    // get signup
    app.get('/signup',(req,res) => {
        console.log("Get Request @ -> " + req.url);
        res.render('signup')
    })

    //get login
    app.get('/login', (req,res) => {
        console.log("Get Request @ -> " + req.url);
        console.log('this is referer' + req.headers.referer)
        res.render('login')
    })
};