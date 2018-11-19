//contains routes for review submission, search, provider Profile

module.exports = (app, con, urlencodedParser) => {
    //review Submit
    
    app.post('/reviewSubmit', urlencodedParser, (req,res) => {
        console.log("POST Request @ -> " + req.url)
        let body = req.body
        let reviewe = body.id
        let reviewer = req.session.user
        let review = body.review
        let rating = body.rating
        let qs = "INSERT INTO review VALUES(null,?,?,?,?)"
        let data = [reviewe, reviewer, review, rating]
        con.query(qs, data, (err, results) => {
            if (err) console.error(err)
            console.log("successfull insertion of the review")

        })

        setTimeout(() => {
            res.redirect(req.headers.referer)
        }, 1)
    })



    //provider Profile
    app.get('/providerProfile', (req, res) => {
        console.log("Get Request @ -> " + req.url)
        console.log('this is referer -> ' + req.headers.referer)
        let id = req.query.id
        let row
        let row2
        let qs = "SELECT * FROM user WHERE id=" + id
        con.query(qs, (err, results) => {
            if(err) throw err;
            // console.log(results);
            row = results
        })

        setTimeout(() => {
            qs = "SELECT * FROM review r, user u where u.id=r.reviewer AND reviewe=" + id;
            con.query(qs, (err, result) => {
                if (err) console.error(err)
                row2 = result
            })
        }, 100)

        setTimeout(() => {

            console.log("This is review rows", row2)

            if(req.session.user){
                if(row.length == 0){
                    res.render('providerProfile', {user: true, provider: null, reviews: row2, id: id})
                }else{
                    res.render('providerProfile', {user: true, provider: row[0], reviews: row2, id: id})
                }
            }
            else{
                if(row.length == 0){
                    res.render('providerProfile',{user: false, provider: null, reviews: row2, id: id})
                }else{
                    res.render('providerProfile', {user: false, provider: row[0], reviews: row2, id: id})
                }
            }
        }, 200)
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

};