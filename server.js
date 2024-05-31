import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
// const request = require('request');

const app = express();
app.use(express.json({limit: '50mb'}));
app.use(cors());
const PORT = process.env.PORT || 8000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Define a route to forward requests to the API server
app.all('/api/*', async (req, res) => {
  try {
    console.log(req.body);
    // console.log(req.headers);
    const headers = req.url == '/api/ValidateLogin' ? {
      "Content-Type": "application/json",
      "AppName": req.headers.appname,
      "SecretKey": req.headers.secretkey
    } : {
      "Content-Type": "application/json",
      "Authorization": "Basic " + req.headers.authorization
    };
    const url = `https://demoapi.emsigner.com${req.url}`; // Replace 'API_BASE_URL' with the base URL of the API server
    // console.log(headers);
    if (req.method === "POST") {
      const response = await fetch(url, {
        method: req.method,
        headers:headers,
        body: JSON.stringify(req.body),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          res.json(data);
        })
    } else {
      const response = await fetch(url, {
        method: req.method,
        headers: headers,
        // body: JSON.stringify(req.body),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          res.json(data);
        })
    }


  } catch (error) {
    console.error('Proxy server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server listening at http://localhost:${PORT}`);
});
