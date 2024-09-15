const { addMessage, getMessages } = require("../controllers/messageController");
const router = require("express").Router();


/**
 * Route to add a new message.
 * HTTP Method: POST
 * Endpoint: /api/messages/addmsg
 * Controller function: addMessage
 * Description: This route is used when a user sends a message.
 * The message data is sent from the frontend and added to the database.
 */
router.post("/addmsg/", addMessage);// /addmsg/: This route is used for adding messages to the chat. When a user sends a message, this route will be triggered.

/**
 * Route to get messages between two users.
 * HTTP Method: POST
 * Endpoint: /api/messages/getmsg
 * Controller function: getMessages
 * Description: This route is used to fetch all messages between two users.
 * When a user opens a chat, the previous conversation messages will be retrieved from the database.
 */

router.post("/getmsg/", getMessages);

module.exports = router;
