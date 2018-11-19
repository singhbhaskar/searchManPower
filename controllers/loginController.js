//contains controller for
// logout
// POST login
// invalid Login
// GET signup
// GET login
//POST signUp

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

     //POST signUp new user
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