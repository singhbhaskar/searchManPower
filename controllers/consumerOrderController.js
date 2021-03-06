module.exports = (app, con, urlencodedParser) => {
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

    //GET myorders shows all the orders done till now
    app.get('/myorders', (req, res) => {
        let user = req.session.user
        let qs ="SELECT u.firstName consumer, p.firstName provider, o.orderStatus, p.cost, o.appointment"
        qs += " FROM orders o, user u, providers p WHERE u.id=o.consumerId AND p.providerId=o.providerId"
        qs += " AND u.id='" +  user + "'"
        let row;

        if(user){
            con.query(qs, (err, results) => {
                if (err) console.error(err)
                console.log("this is res")
                console.log(results)
                row = results
            })
        }
        else{
            res.redirect('/')
        }

        setTimeout(() => {
            console.log(row)
            res.render('myorders', {user: true, orders: row, l: row.length})
        })
    })
};