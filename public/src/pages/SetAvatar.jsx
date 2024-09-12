import React, { useEffect, useState } from "react";
import styled from "styled-components";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Avatar1 from "../avatars/avatar1.png";
import Avatar2 from "../avatars/avatar2.png";
import Avatar3 from "../avatars/avatar3.png";
import Avatar4 from "../avatars/avatar4.png";
import Avatar5 from "../avatars/avatar5.png";

// Import other avatars as needed

// Configuration options for the toast notifications
const toastOptions = {
  position: "bottom-right",
  autoClose: 8000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
};

// List of all avatars that users can choose from : 
const avatarsList = [Avatar1, Avatar2,Avatar3,Avatar4,Avatar5]; // Add more avatars here

export default function SetAvatar() {
  const navigate = useNavigate(); // Hook for navigating to different routes
  const [avatars, setAvatars] = useState(avatarsList);// State to hold the list of avatars
  const [isLoading, setIsLoading] = useState(false); // State to manage loading status
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);// State to track which avatar is selected


    // useEffect to check if the user is logged in
  useEffect(() => {
    const checkLocalStorage = async () => {//definition of function
      try { // Check if user data exists in localStorage
        if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
          navigate("/login"); // If not, redirect them to the login page
        }
      } catch (error) {
        console.error("Error checking localStorage:", error);// Log any error that occurs
        navigate("/login");// Redirect to login page in case of error
      }
    };

    checkLocalStorage();//usage of function!
  }, [navigate]);


  // Function to set the profile picture when the user selects an avatar
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      // If no avatar is selected, show an error toast
      toast.error("Please select an avatar", toastOptions);
    } else {
      try {
        // Get the user data from localStorage
        const user = JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        );
          
        const selectedAvatarUrl = avatars[selectedAvatar];// Get the URL of the selected avatar
        user.isAvatarImageSet = true;// Mark the avatar as set
        user.avatarImage = selectedAvatarUrl;// Save the selected avatar URL to the user data
          //in json object if the user object doesnt have a property named avatarImage it creates one and then assigns!
        // Update the user data in localStorage
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)//must stringify the user and then only save in the localStorage!
        );
        navigate("/");// Navigate to the home page after setting the avatar
      } catch (error) {
        console.error("Error setting profile picture:", error);
        toast.error(
          "Failed to set avatar. Please try again later.",
          toastOptions
        );
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Container>
          <img src={loader} alt="loader" className="loader" />
        </Container>
      ) : (
        <Container>
          <div className="title-container">
            <h1>Pick an Avatar as your profile picture</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}//The className is set dynamically. If the selectedAvatar state matches the current index, the class selected is added, which can be used for styling the selected avatar.
                onClick={() => setSelectedAvatar(index)}//the index is passed to the setSelectedAvatar taking index as argument so it updates the selected avatar!
              >                                         
                <img src={avatar} alt={`Avatar ${index}`} />
              </div>
            ))}
          </div>
          <button onClick={setProfilePicture} className="submit-btn">
            Set as Profile Picture
          </button>
          <ToastContainer />
        </Container>
      )}
    </>
  );
}
// The onClick event handler calls the setSelectedAvatar(index) function, passing the index value to it.
// {avatars.map((avatar, index) => ( ... ))}:

// This is a JavaScript expression inside JSX, using the map() function to iterate over the avatars array. map() is used to generate a list of JSX elements.
//If you have an array const colors = ["red", "green", "blue"], and you use map() like this:
// colors.map((color, index) => {
//   console.log(color, index);
// });
// This will output:
// red 0
// green 1
// blue 2




const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }

  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;

      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }

    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }

  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;

    &:hover {
      background-color: #4e0eff;
    }
  }
`;
