import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";// Import uuid library for generating unique keys
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";// Import API routes for sending and receiving messages
     
// Import a default avatar image to use for the user
import DefaultAvatar from "../avatars/avatar1.png"; // Adjust the path as needed


// Define the ChatContainer component that takes 'currentChat' and 'socket' as props
export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]); // State to hold messages in the chat
  const scrollRef = useRef();  // useRef to keep track of the last message for auto-scrolling
  const [arrivalMessage, setArrivalMessage] = useState(null); // State to hold a newly arrived message

    // Fetch chat messages when the component mounts or when currentChat changes
  useEffect(() => {
    const fetchData = async () => {
      const userData = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));// Retrieve user data from local storage
      const response = await axios.post(recieveMessageRoute, {//axios.post(...) sends a POST request to the server. and recieveMessageRoute is the URL to which the request is sent.

              //{ from: userData._id, to: currentChat._id } is an object containing data to be sent to the server (IDs of the sender and receiver).
        from: userData._id,// Sender's ID... When a user logs into your application, their data (including a unique user ID, user._id) is typically fetched from the backend server.
        to: currentChat._id,// Receiver's ID ...: Comes from the chat information passed to the ChatContainer component as a prop, which is determined by which chat the user selects in the chat interface.
      });
      setMessages(response.data);// Set messages state with received data
    };
  
    fetchData();// Call the fetchData function to load messages
  }, [currentChat]);// Dependency array ensures the effect runs when 'currentChat' changes
  
  
  // the response looks like:{
  //   data: [
  //     {
  //       _id: "12345", // Unique ID for the message
  //       from: "user1_id", // ID of the sender
  //       to: "user2_id", // ID of the receiver
  //       message: "Hello! How are you?", // The content of the message
  //       timestamp: "2024-09-01T12:00:00Z", // When the message was sent
  //     },
  //     {
  //       _id: "67890",
  //       from: "user2_id",
  //       to: "user1_id",

  // Basic Syntax of axios.post:
  // axios.post(url, data, config);
//   url: The endpoint where you want to send your data. This is usually a string that specifies the route on your server (e.g., '/api/sendMessage').
//  data: The data object you want to send to the server. This object contains the key-value pairs that the server expects to receive (e.g., user IDs, message content).
//  config (optional): An object that contains additional settings for the request, such as headers, authentication tokens, etc




  // Check and get the current chat data from local storage
  useEffect(() => {
    // Define an asynchronous function to get the current chat user data
    const getCurrentChat = async () => {
      // Check if the `currentChat` object is available (i.e., a chat has been selected)
      if (currentChat) {
        // Retrieve the stored user data from local storage using a key from environment variables
        // Parse the retrieved JSON string to get the user object
        // Await keyword is used to wait for the promise returned by JSON.parse (though it's not necessary here)
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
     // Call the getCurrentChat function to execute it
    getCurrentChat();
  }, [currentChat]);//runs when the user updates the current chat!

  // Function to handle sending a message
  const handleSendMsg = async (msg) => {
    try {
       // Retrieve the stored user data from local storage
       // This data was previously saved, and it contains information about the logged-in user
      const userData = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));// Retrieve user data
     
          // Emit a message event using the socket connection
          // This sends the message in real-time to the recipient via WebSocket\
          //socket.current:
                  // The socket is likely created somewhere else in your application (perhaps in a central file where you handle all your socket connections).
                  // socket.current refers to the current active socket connection being used.
                  // "send-msg" is the name of the event you are emitting.
      socket.current.emit("send-msg", {
        to: currentChat._id,// Receiver's ID// The ID of the user who will receive the message
        from: userData._id,// Sender's ID
        msg,  // The actual content of the message being sent

      });
      //  socket.current: This refers to the WebSocket connection your app has with the server. It's like having a direct line to the server where you can send and receive messages instantly.
      // .emit("send-msg", ...): emit is a method that sends a message to the server. The first argument ("send-msg") is the name of the message or event you're sending. In this case, "send-msg" tells the server, "Hey, I'm sending a message!"
        // Send the message to the server to store it in the database
        // Uses the HTTP POST method to send the message data to the specified route
      await axios.post(sendMessageRoute, {
        from: userData._id,
        to: currentChat._id,
        message: msg,
      });
      // Update the messages state with the new message
      setMessages((prevMessages) => [...prevMessages, { fromSelf: true, message: msg }]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error (e.g., show toast message)
    }
  };


  // Effect to handle receiving messages through the socket connection
  useEffect(() => {
    if (socket.current) {
      const currentSocket = socket.current;
      
      // Listen for incoming messages
      currentSocket.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
      // The .on("msg-recieve", ...) part means that whenever the server sends a message event with the name "msg-recieve", the function provided as the second argument will be executed.
      // The msg parameter contains the message data that was sent by the server when this event was triggered.

      // Cleanup function to remove the event listener when component unmounts
      return () => {
        currentSocket.off("msg-recieve");
      };
    }
  }, [socket]);


    // Effect to update messages state when a new message arrives 
  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

   // Effect to auto-scroll to the latest message whenever messages change
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            {/* Display selected avatar */}
            <img src={DefaultAvatar} alt="Avatar" />
          </div>
          <div className="username">
            <h3>{currentChat.username}</h3>
          </div>
        </div>
        <Logout />
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div ref={scrollRef} key={uuidv4()}>
            <div className={`message ${message.fromSelf ? "sended" : "recieved"}`}>
              <div className="content">
                <p>{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;
