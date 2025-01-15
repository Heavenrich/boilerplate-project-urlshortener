require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
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
var urls = {};
var shortUrls = {};

app.post('/api/shorturl', function(req, res) {
  try{
    dns.lookup(req.body.url, (err, address, family) => {
      if(err) {
        res.json({error: 'Invalid Url'});
        return console.log('not an active website');
      }
      
      if (req.body.url in urls) {
        res.json({original_url: req.body.url, short_url: urls[req.body.url]});
        return;
      }
  
      numUrls += 1;
      urls[req.body.url] = String(numUrls);
      shortUrls[String(numUrls)] = req.body.url
      res.json({original_url: req.body.url, short_url: numUrls});

    });
  } catch {
    res.json({error: 'Invalid Url'});
    return console.log('dns error');
  }
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  console.log(req.params.shortUrl);
  console.log(shortUrls);
  if(String(req.params.shortUrl) in shortUrls) {
    res.redirect(shortUrls[String(req.params.shortUrl)]);
    return;
  }

  res.send('Not Found');
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
