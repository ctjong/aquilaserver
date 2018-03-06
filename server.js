var orion = require('orion-api');
var config = require('./config');

var app = new orion(config);
app.setupApiEndpoints();

app.get("/healthcheck", function (req, res) 
{
    res.status(200).end();
});

app.start();