const express = require('express');
const http = require('http');
const { EventEmitter } = require('events');
const socketIO = require('socket.io'); // Import socket.io

const app = express();
const cors = require('cors');
const server = http.createServer(app);
const io = socketIO(server); // Create a WebSocket server

const eventEmitter = new EventEmitter();

app.use(cors());
app.use(express.static('public'));
app.use(express.json()); // Middleware to parse JSON requests

app.get('/events', (req, res) => {
    // Your existing SSE route logic
    // ...
});

app.post('/update', (req, res) => {
    const { text } = req.body;
    console.log(`Received: ${text}`);
    eventEmitter.emit('data', text);
    res.sendStatus(200);
});

// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('Client connected');

    // Listen for messages from the client
    socket.on('message', (data) => {
        // Broadcast the received data to all connected clients
        io.emit('data', data);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

module.exports = app