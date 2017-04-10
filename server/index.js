var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var api = require("./api");
var routeMw = require("./middleware/routing.mw");
var cookieParser = require("cookie-parser");
var configurePassport = require("./config/passport");

var app = express();

app.use(express.static(path.join(__dirname, "../client")));
app.use(bodyParser.json());
app.use(cookieParser());

configurePassport(app);

app.use('/api', api);

app.get("*", function(req, res, next) {
    if(routeMw.isAsset(req.url)) {
        next();
    } else {
        res.sendFile(path.join(__dirname, "../client/index.html"));
    }
})

app.listen(3000);

