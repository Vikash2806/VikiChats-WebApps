const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Users", userSchema);
// Here, we create a model called User based on the userSchema.

// Simple Example: Let’s assume we are creating a new user based on this model:
// const newUser = new User({
//   username: "JohnDoe",
//   email: "john@example.com",
//   password: "mypassword123"
// });

// 1. What is a Schema?
// A schema in Mongoose defines the structure of the data that will be 
// stored in the MongoDB database. It sets up a blueprint or outline for 
// the data in the form of keys and their types, along with any constraints 
// such as required fields or default values.

// 2. What is a Model?
// A model in Mongoose is a wrapper for the schema. 
// It provides an interface to interact with the database.
//  With a model, you can perform operations like creating, reading, updating, and 
// deleting documents (records).

