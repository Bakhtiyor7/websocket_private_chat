const WebSocket = require('ws');

// Create a new WebSocket server on port 8080
const wss = new WebSocket.Server({ port: 8080 });

// Keep track of connected clients
const clients = {};

// Handle incoming connections
wss.on('connection', (ws, req) => {
    console.log('New client connected');

    // Generate a unique ID for this client
    const id = Date.now();

    // Add the client to the list of connected clients
    clients[id] = ws;

    // Send a welcome message to the client
    ws.send(`Welcome to the chat! Your ID is ${id}`);

    // Handle incoming messages from the client
    ws.on('message', (message) => {
        console.log(`Received message from client ${id}: ${message}`);

        // Parse the message as JSON
        const data = JSON.parse(message);

        // If the message is a "chat" message, send it to the target client
        if (data.type === 'chat') {
            const targetClient = clients[data.target];
            if (targetClient) {
                targetClient.send(`Client ${id} says: ${data.message}`);
            } else {
                ws.send(`Target client ${data.target} not found`);
            }
        }
    });

    // Handle disconnections
    ws.on('close', () => {
        console.log(`Client ${id} disconnected`);
        delete clients[id];
    });
});
