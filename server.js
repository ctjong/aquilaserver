var orion = require('orion-api');
var config = require('./config');

orion.setConfig(config);
var app = orion.createApiApp();
orion.startApiApp(app);