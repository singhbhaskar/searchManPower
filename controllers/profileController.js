//This controller contains
//myprofile for showing the current data of the profile
// GET invalidPassword redirected if current password is incorrect
//POST Change Password form for change in password
// GET Change Password
// GET Upate Profile
//POST Update Profile form for the change in profile data

module.exports = (app, con, urlencodedParser) => {
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
                    // console.log(row[0], user)
                    res.render('myprofile', {user: true, profile: row[0]})
                }
                else{
                    res.redirect(req.headers.referer)
                }
            }, 200)
        })
    
        // GET invalidPassword
        app.get('/invalidPassword', (req, res) => {
            res.render('changePassword', {user: true, err: "Wrong Password re-try"})
        })
    
        //POST Change Password
        app.post('/changePassword', urlencodedParser, (req, res) => {
            let body = req.body
            let current = body.current
            let pass1 = body.password1
            let pass2 = body.password2
            let user = req.session.user
            let flag = 0
    
            con.query('SELECT password from user where id='+ user , (err, results) => {
                if (err) console.error(err)
                console.log(results)
                if(current === results[0].password){
                    flag = 1
                }
            })
    
            setTimeout(() => {
                if(flag){
                    if(pass1 === pass2){
                        let qs = "UPDATE user SET password='" + pass1 + "' WHERE id='" + user + "'"
                        con.query(qs, (err, results) => {
                            if (err) console.error(err)
                            console.log("Sucess in Password Change!") 
                        })
                    }
                    else{
                        flag = 0
                    }
                }
            }, 100)
    
            setTimeout(() => {
                if(flag){
                        res.redirect('/myProfile')   
                }else{
                    res.redirect('/invalidPassword')
                }
            }, 100)
        })
    
        // GET Change Password
        app.get('/changePassword' ,(req,res) => {
            if(req.session.user){
                res.render('changePassword', {user: true, err: null})
            }
            else{
                res.redirect(req.headers.referer)
            }
        })
    
        // GET Upate Profile
        app.get('/update', (req, res) => {
            let user = req.session.user
            let qs = "SELECT * FROM user WHERE id=" + user
            let row;
    
            con.query(qs, (err, results) => {
                if (err) console.error(err)
                row = results[0]
            })
    
            setTimeout(() => {
                if(user){
                    console.log(row)
                    res.render('update', {user: true, profile: row})
                }
                else{
                    res.redirect(req.headers.referer)
                }
            }, 100)
        })
    
    
        //POST Update Profile
        app.post('/update', urlencodedParser, (req, res) => {
            let body = req.body
            let firstName = body.first_name
            let lastName = body.last_name
            let email = body.email
            let status = body.status
            let user = req.session.user
            let qs = "UPDATE user SET firstName=?, lastName=?, email=?, status=? WHERE id='" + user +"'"
            let data = [firstName, lastName, email, status]
            con.query(qs, data, (err, results) => {
                if (err) console.error(err)
                console.log("Sucess in update")
            })
    
            setTimeout(() => {
                res.redirect('/myProfile')
            }, 100)
    
    
        })
};