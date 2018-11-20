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

};