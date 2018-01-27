var orion = require('orion-api');
var config = require('./config');

var app = orion.create(config);
app.get("/healthcheck", function (req, res) 
{
    res.status(200).end();
});

app.start();