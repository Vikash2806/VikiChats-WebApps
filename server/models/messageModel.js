const mongoose = require("mongoose");


// Define the Message schema (blueprint) for the database
const MessageSchema = mongoose.Schema(
  {
      // This field stores the message text
    message: {
      text: { type: String, required: true },// The message is a required string
    },

    // This field stores the users involved in the conversation (an array of user IDs)
    users: Array,

    // This field stores the sender of the message (linked to the User model)
    sender: {
      type: mongoose.Schema.Types.ObjectId,// The sender is referenced by their unique ObjectId
      ref: "User",// Refers to the User collection in the database
      required: true,// The sender is required
    },
  },
    // Automatically add 'createdAt' and 'updatedAt' timestamps to each messagex
  {
    timestamps: true,
  }
);

// Export the Mongoose model 'Messages' based on the MessageSchema
module.exports = mongoose.model("Messages", MessageSchema);


// example of schema:
// const BookSchema = mongoose.Schema({
//   title: { type: String, required: true },
//   author: { type: String, required: true },
//   year: { type: Number }
// });

// const newMessage = new Message({
//   message: { text: "Hello World!" },
//   users: ["user1", "user2"],
//   sender: user._id
// });

// newMessage.save().then(() => console.log("Message saved!"));
// This example creates a message and saves it in the database, linking it to users and a sender.