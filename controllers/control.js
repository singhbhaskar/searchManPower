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

    //myprofile
    app.get('/myprofile', (req,res) => {
        let user = req.session.user
        let qs = "SELECT * FROM user WHERE id='" + user + "'"
        let row
        con.query(qs, (err, results) => {
            if (err) console.error(err)
            row = results
        })

        setTimeout(() => {
            if(req.session.user){
                console.log(row[0], user)
                res.render('myprofile', {user: true, profile: row[0]})
            }
            else{
                res.redirect(req.headers.referer)
            }
        }, 200)
    })

};