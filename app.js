const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const path = require("path");
const compression = require('compression');

app.use(express.static('./client/static/'));
app.use(express.static('./client/dist/'));


app.use(function(req, res, next) {
    // Instead of "*" you should enable only specific origins
    res.header('Access-Control-Allow-Origin', '*');
    // Supported HTTP verbs
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // Other custom headers
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// compress all responses
app.use(compression());

// Middleware
app.use(bodyParser.json());

// Render html from serverside
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '/client/static/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})

const port = 8080;

app.listen(port, () => console.log(`Server started on port ${port}`));
