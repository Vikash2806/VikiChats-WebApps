// Import necessary controller functions from the userController file
const {
    login,     // Function to handle user login
    register, // Function to handle user registration
    getAllUsers,  // Function to retrieve all users except the current one
    setAvatar,  // Function to set the user's avatar  
    logOut,   // Function to handle user logout
  } = require("../controllers/userController");
  
  // Import Express and create a new router instance
  const router = require("express").Router();

  // Define the routes and associate them with controller functions

// Route for user login
// HTTP Method: POST
// Endpoint: /api/auth/login
// Description: Handles user login by verifying credentials
  router.post("/login", login);
  // Route for user registration
// HTTP Method: POST
// Endpoint: /api/auth/register
// Description: Handles new user registration by creating a user account
  router.post("/register", register);
  // Route to get all users except the current user
// HTTP Method: GET
// Endpoint: /api/auth/allusers/:id
// Description: Retrieves a list of all users for the chat application
// :id is a URL parameter representing the current user's ID
  router.get("/allusers/:id", getAllUsers);
  // Route to set the user's avatar
// HTTP Method: POST
// Endpoint: /api/auth/setavatar/:id
// Description: Updates the user's avatar image
// :id is a URL parameter representing the user's ID
  router.post("/setavatar/:id", setAvatar);

// Route for user logout
// HTTP Method: GET
// Endpoint: /api/auth/logout/:id
// Description: Logs out the user and updates their online status
// :id is a URL parameter representing the user's ID
  router.get("/logout/:id", logOut);
  // Export the router to be used in other parts of the application
  module.exports = router;
  