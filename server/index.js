const express = require("express");
const cors = require("cors");// Middleware to handle Cross-Origin Resource Sharing (CORS)
const mongoose = require("mongoose"); //A library to connect and interact with MongoDB, making it easier to handle data.
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messagesRoute");
const app = express();// Initializing the Express application ..creates an Express app.
const socket = require("socket.io");
require("dotenv").config();


// Middleware setup
app.use(cors());// Enables CORS, allowing cross-origin requests..It’s a security feature that controls who can access your server.
app.use(express.json());// Parses incoming JSON requests and puts the data in req.body


  
// Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,// Ensures use of the new URL string parser instead of the deprecated one
    useUnifiedTopology: true,// Enables the new unified topology engine for MongoDB connection handling
  })
  .then(() => {
    console.log("DB Connetion Successfull");// Logs successful DB connection
  })
  .catch((err) => {
    console.log(err.message); // Logs errors if connection fails
  });

//   Connecting to MongoDB: Mongoose connects to your MongoDB database:
//         Example: .connect() method takes a connection string (process.env.MONGO_URL) and options (useNewUrlParser, useUnifiedTopology).
//         then() is called when the connection is successful, and catch() handles errors.


  // A simple test route for the server to check if it's running

app.get("/ping", (_req, res) => {
  return res.json({ msg: "Ping Successful" });// Sends a JSON response with a "Ping Successful" message
});

// Routes setup
// All routes for authentication go to /api/auth
app.use("/api/auth", authRoutes);

// All routes for messages go to /api/messages
app.use("/api/messages", messageRoutes);


// Starting the server and listening on a port defined in the environment variables
const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)// Logs the port number when the server starts
);
// Starting the Express Server: The server listens on a port defined in .env file.
// Syntax: app.listen(port, callback)
// Example: app.listen(3000, () => console.log("Server started on 3000"));

// Socket.IO setup for real-time communication
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000", // Allowing requests from the React frontend running at localhost:3000
    credentials: true, // Enables cookies and authorization headers with requests
  },
});

// Global object to store online users and their socket IDs
global.onlineUsers = new Map();// A Map to store userId as the key and socket.id as the value

// Listening for new socket connections
io.on("connection", (socket) => {
  global.chatSocket = socket; // Stores the current socket globally for future use

   // Listening for 'add-user' event when a user comes online
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

   // Listening for 'send-msg' event when a user sends a message
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);// Retrieves the socket ID of the message receiver
    if (sendUserSocket) {
        // If the receiver is online, emit the 'msg-receive' event to their socket
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);// Sends the message to the receiver
    }
  });
});

// Real-Time Events:

// connection event: Fired when a new user connects to the server.
// add-user event: Stores the user’s socket ID for identifying them during communication.
// send-msg event: When a user sends a message, it looks up the recipient’s socket ID and forwards the message.
// Example:

// socket.on('event-name', (data) => { ... }) listens for events from the client.
// socket.emit('event-name', data) sends an event to the client.
