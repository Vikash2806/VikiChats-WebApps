import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
  const navigate = useNavigate();// To redirect users to different pages.
  const socket = useRef();// To maintain a persistent WebSocket connection.
  
// Why Use useRef for a Socket?
// When working with real-time communication, such as WebSockets (often referred to as just "sockets"), you need to establish and maintain a connection to a server. useRef is helpful in this scenario because:

// Maintains the Same Object Across Renders: The WebSocket connection needs to be the same throughout the component's life. If you use useState, it could cause unnecessary re-renders, whereas useRef keeps the same object without re-rendering the component.
// Access Without Re-Initialization: With useRef, you can maintain and access the socket instance without re-initializing it every time the component re-renders.


  const [contacts, setContacts] = useState([]);// Holds a list of chat contacts.
  const [currentChat, setCurrentChat] = useState(undefined);// Keeps track of the current chat.
  const [currentUser, setCurrentUser] = useState(undefined);// Holds information about the currently logged-in user.

  useEffect(() => {
    //The async is  to ensure the UI remains responsive and non-blocking when handling tasks that might take time
  
    const fetchData = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {//it checks the local browser storage for use details
        navigate("/login");// it means the user is not authenticated on the client side, so the code redirects to the login page.
      } else {//note login is different from Register.If the key is found, the user is considered authenticated, and the data is fetched from localStorage for use in the app
        setCurrentUser(
          await JSON.parse(//JSON.parse(): Converts String to JavaScript Object
            localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
          )//The value passed to setCurrentUser is the parsed object from localStorage, which contains the user’s information.
        );//After this call, currentUser in the component will be updated to the user object: { username: "Alice", email: "alice@example.com" }.
      }
    };
    fetchData();//The fetchData() function is called immediately within the useEffect to execute the logic described above.
  }, [navigate]);//means that this effect will only re-run if the navigate

  // This code snippet appears to be part of a React component, 
  // and it handles checking user authentication and 
  // redirecting the user to a login page if they are not authenticated.

//   This useEffect runs once the component mounts 
// (when the page loads or the component is rendered for the first time).
// It checks if the user is authenticated by verifying if some key exists in localStorage.
// If the user is not authenticated, it redirects them to the login page.
// If the user is authenticated, it retrieves and sets the current user state.

// useEffect(() => { ... }, [navigate]); — This line defines a side effect that 
// runs whenever the navigate dependency changes. However, 
// in this case, navigate is unlikely to change, so the effect runs only 
// once after the initial render.

// localStorage only stores data as strings.
//  Therefore, when you save an object, you typically use JSON.stringify() 
// to convert it into a string. When retrieving that data, you use



  useEffect(() => {
    if (currentUser) {// If the user is authenticated
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);//.emit is a function that sends a message from our app to the server. It’s like making a call or sending a text.
    }
  }, [currentUser]);//Run the code inside useEffect whenever the currentUser changes."
//add-user This is the event name or the "subject" of the message being sent to the server.
//currentUser._id is the  data being sent along with the event. It's the unique ID of the user currently logged in or using the app.
// currentUser is an object that contains details about the user, like their username, email, and, importantly, their unique ID, which is _id.

  // socket is a special kind of variable created earlier in the code
  // useRef. It’s like a container that holds the connection to a server
  // .current is a part of this socket container where we store our connection.

  // io is a function from a library called socket.io-client. 
  // This function helps us create a connection between our app (running on the user’s computer) and
  //  a server somewhere on the internet.
  // host is the address of the server we want to connect to. 
  // It’s like a phone number or web address where our server can be reached.
  
  // Connecting to the Server:
  // The code io(host) uses the address http: localhost:5000 to find and connect to the server running on your computer.
  // It's like dialing a specific phone number (localhost) and extension (:5000) to talk to the server.

  

  useEffect(() => {
    const fetchContacts = async () => {// an asynchronous function (marked by async), which means it can perform tasks that take some time without freezing  the rest of the app.
      if (currentUser) {//Checks if the user is authenticated (i.e., currentUser exists).
        if (currentUser.isAvatarImageSet) {//isAvatarImageSet is a property of the currentUser object. It’s a boolean value, meaning it’s either true (the user has set an avatar image) or false (they haven’t).
          const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);//Here, it’s asking the server for a list of contacts belonging to the user with the unique ID currentUser._id./.its just a path. i.e:"http://localhost:5000/api/auth/allusers/1234"
          setContacts(data.data);//setContacts(data.data) takes the list of contacts received from the server and updates the contacts state in your app.
        } else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);//If you think of currentUser and navigate as triggers, then this code runs whenever those triggers change.

  // this code checks if a user is logged in, verifies if they have set a profile picture (avatar), and then either fetches their contacts or redirects them to set an avatar.
  //axios.get() is a function that makes a request to the server to get data.
  // ${allUsersRoute}/${currentUser._id} is the URL or endpoint the app is contacting. It might look like "http://localhost:5000/users/1234", where 1234 is the user’s ID.
  //In this case, data will store the response from the server when we ask for information (specifically, the user's contacts).
  // await as a "pause button" that lets the code "wait" until the requested data has been received before continuing.
  //here:export const allUsersRoute = `${host}/api/auth/allusers`;

  // ${allUsersRoute}/${currentUser._id}:

 // This is the URL (Uniform Resource Locator), or the web address, where the request is being sent. The URL specifies where to find the resource (like user data) on the server.
 // ${...}: This syntax is called template literals in JavaScript. It allows you to insert variables or expressions inside a string. The backticks (``) are used to wrap the entire URL, and ${...} is used to inject dynamic content.
 // allUsersRoute: This is a variable defined elsewhere in your code, and it holds part of the URL where the request will be sent. For example, allUsersRoute might look like "http://localhost:5000/users".

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };
  //The chat parameter represents the chat that the user has selected. This could be an object that contains information about the selected chat, such as:
// The ID of the chat.
// The name of the user you're chatting with.
// Any other details related to the selected chat.
// example:handleChatChange({ id: 2, name: "Bob", email: "bob@example.com" });
// One of the main reasons we use a separate function like handleChatChange instead of directly calling setCurrentChat is flexibility. 
// When you use a function, you have the ability to add more logic or processing steps before updating the state.

  return (
    <>
      <Container>
        <div className="container">
          <Contacts contacts={contacts} changeChat={handleChatChange} />
          {currentChat === undefined ? (
            <Welcome />
          ) : (
            <ChatContainer currentChat={currentChat} socket={socket} />
          )}
        </div>
      </Container>
    </>
  );
}

// contacts={contacts}: Passes the list of contacts to the Contacts component.
// changeChat={handleChatChange}: Passes the handleChatChange function to the Contacts component so that whenever a user selects a contact, it triggers this function to change the current chat.

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
