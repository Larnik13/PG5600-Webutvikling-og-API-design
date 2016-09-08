var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var config = require('./config');
var util = require('./util');
var api = require('./api');
var morgan = require('morgan');
var https = require('https');
var path = require('path');
var fs = require('fs');
var certPath = './cert';

var httpsOptions = {
    key: fs.readFileSync(path.join(certPath, 'pprecords.key')),
    cert: fs.readFileSync(path.join(certPath, 'pprecords.crt'))
};

app.enable('trust proxy');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', cors());
app.use(morgan('dev'));
app.use('/api', api);


const server = https.createServer(httpsOptions, app).listen(3000, () => {
  console.log('Message server listening on port 3000!');
});

require('./sockets').connect(server);
