module.exports = (app, con, urlencodedParser) => {

    app.get('/',(req,res) => {
        console.log("Get Request @ -> " + req.url);
        if(req.session.user){
            res.render('index', {user: true})
        }
        else{
            res.render('index', {user: false})
        }
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

    //GET Order for booking order
    app.get('/order', (req, res)=> {
        let id = req.query.id
        let user = req.session.user
        if(user){
            res.render('order', {id: id, user: true})
        }
        else{
            res.redirect(req.headers.referer)
        }
    })

    //POST Order form for booking
    app.post('/order', urlencodedParser, (req, res) => {
        let body = req.body
        let user = req.session.user
        let provider = body.id
        let appoint = body.appoint
        let note = body.note
        let orderStatus = "Requested"
        let data = [user, provider, appoint, note, orderStatus]
        let qs = "INSERT INTO orders VALUES (null, ?, ?, ?, ?, ?, null)"
        if(user){
            con.query(qs, data, (err, result) => {
                if(err) console.error(err)
    
                console.log("Success in order!")
            })
        }

        setTimeout(() => {
            res.redirect('/')
        }, 100)

    })

};