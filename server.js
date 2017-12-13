var express = require('express');
var orion = require('orion-api');
var config = require('./config');

var app = new express();
orion.setConfig(config);
orion.setupApiEndpoints(app);
orion.startApiApp(app);