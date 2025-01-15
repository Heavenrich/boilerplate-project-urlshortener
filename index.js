require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const url = require('url');
const dns = require('node:dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

var numUrls = 0;
var urlDict = {};
var shortUrlDict = {};

app.post('/api/shorturl', function(req, res) {
  urlObj = url.parse(req.body.url);

  if (!(urlObj.protocol && urlObj.host)) {
    res.json({error: 'Invalid Url'});
    return console.log('not a full url');
  }
      
    if (req.body.url in urlDict) {
      res.json({original_url: req.body.url, short_url: urls[req.body.url]});
      return;
    }

    numUrls += 1;
    urlDict[req.body.url] = numUrls;
    shortUrlDict[numUrls] = req.body.url
    res.json({original_url: req.body.url, short_url: numUrls});
});


app.get('/api/shorturl/:shortUrl', (req, res) => {
  console.log(req.params.shortUrl);
  console.log(shortUrlDict);
  console.log(urlDict)
  if(req.params.shortUrl in shortUrlDict) {
    res.redirect(shortUrlDict[req.params.shortUrl]);
    return;
  }

  res.send('Not Found');
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
