module.exports = (app, con, urlencodedParser) => {


    //refresh
    app.get('/refresh', (req,res) => {
        console.log("GET Request @ -> " + req.url);
        res.redirect(req.headers.referer)
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