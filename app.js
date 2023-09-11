const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { EventEmitter } = require('events');
const cors = require('cors');

const eventEmitter = new EventEmitter();

app.use(cors());
app.use(express.static('public'));
app.use(express.json()); // Middleware to parse JSON requests

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const onDataReceived = (data) => {
        res.write(`data: ${data}\n\n`);
    };

    eventEmitter.on('data', onDataReceived);

    req.on('close', () => {
        eventEmitter.removeListener('data', onDataReceived);
    });
});

app.post('/update', (req, res) => {
    const { text } = req.body;
    console.log(`Received: ${text}`); // Log the received text to the terminal
    eventEmitter.emit('data', text);
    res.sendStatus(200);
});


// Please comment the above lines and uncomment the line below to use the socket.
// const app = require("./withSocket");

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});