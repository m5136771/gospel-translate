const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors());
app.use(express.json());

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    const messageString = message.toString(); // Convert Buffer to string
    console.log("Received:", messageString);
    try {
      const jsonData = JSON.parse(messageString);
      console.log("Parsed JSON:", jsonData);
      // Broadcast the JSON data to all connected clients
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(jsonData));
        }
      });
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  });

  const message = { message: "WebSocket connection established" };
  ws.send(JSON.stringify(message));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
