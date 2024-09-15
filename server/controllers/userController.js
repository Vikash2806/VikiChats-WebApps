const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;  // Extracting the username and password from the request body
    const user = await User.findOne({ username });
    if (!user)  // If no user is found, send a message saying "Incorrect Username or Password"
      return res.json({ msg: "Incorrect Username or Password", status: false });

       // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)   // If the password is incorrect, send the same error message
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password; // Remove the password field from the user object before sending it back
    return res.json({ status: true, user });// Return success status and user info
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;  // Extracting user details from the request body
   
    // Check if the username already exists in the database
   const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

     // Hash the user's password before saving it in the database 
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database with the provided details
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    }); 
    delete user.password; // Remove the password field from the user object
    return res.json({ status: true, user }); // Send success response
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
     // Find all users except the one with the ID provided in the request params
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users); // Send the list of users as a JSON response
  } catch (ex) {
    next(ex);
  }
}; 

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;// Get the user ID from the request parameters
    const avatarImage = req.body.image;// Get the new avatar image from the request body
    // Find the user by ID and update their avatarImage and isAvatarImageSet fields
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }// Ensure the updated user data is returned
    );
    return res.json({
      isSet: userData.isAvatarImageSet,// Return the status of the avatar image setting
      image: userData.avatarImage,// Return the updated avatar image
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
     // Remove the user from the onlineUsers map
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
