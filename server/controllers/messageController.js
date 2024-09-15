const Messages = require("../models/messageModel");

// getMessages: This function retrieves all the messages between two users. It uses the Messages model to search the database and returns the messages in ascending order.
// addMessage: This function adds a new message to the database. It stores the message text, the users involved, and the sender's ID. If successful, it returns a success message; otherwise, it returns an error.


// This function retrieves all the messages exchanged between two users from the database.
module.exports.getMessages = async (req, res, next) => {
  try {
     // Extracting 'from' (sender) and 'to' (recipient) from the request body
    const { from, to } = req.body;//the from and to values are taken from the req.body

     // Searching the database for messages between these two users
    const messages = await Messages.find({
      users: {
        $all: [from, to], // Look for messages that have both 'from' and 'to' in the users array
      },
    }).sort({ updatedAt: 1 }); // Sort messages in ascending order by the time they were last updated

     // Creating a new array of messages with only relevant data for the frontend
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,// Check if the message was sent by the current user
        message: msg.message.text,// Extract the message text
      };
    });
    // Send the filtered messages back as a JSON response to the client
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);// Pass any errors to the error handler
  }
};

// This function adds a new message to the database.
module.exports.addMessage = async (req, res, next) => {
  try {
    
     // Extracting 'from' (sender), 'to' (recipient), and 'message' from the request body
    const { from, to, message } = req.body;
     // Creating a new message document and saving it in the database
    const data = await Messages.create({
      message: { text: message },   // Storing the message text.
      users: [from, to],    // Storing both users (sender and recipient).
      sender: from,    // Storing the ID of the user who sent the message.
    });

    // If the message was successfully added, send a success message
    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
