module.exports = (app, con, urlencodedParser) => {


    //refresh
    app.get('/refresh', (req,res) => {
        console.log("GET Request @ -> " + req.url);
        res.redirect(req.headers.referer)
    })

};