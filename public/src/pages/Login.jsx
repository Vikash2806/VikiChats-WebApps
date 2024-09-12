import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginRoute } from "../utils/APIRoutes";

export default function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });//values: State object holding username and password.
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };//Configuration for toast notifications, such as position, auto-close duration, and theme.


  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, [navigate]);//Runs when the component mounts.
  // Checks if there’s a login token in local storage. If found, it redirects to the home page ("/").
  // A login token, often referred to as an authentication or JWT (JSON Web Token):
  // A JWT (JSON Web Token) consists of three parts:
  // Header
  // Payload
  // Signature so,
//   Payload (decoded):
// {
//   "sub": "1234567890",
//   "name": "John Doe",
//   "iat": 1516239022
// }

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // setValues({
  //   ...values,             // { name: 'John', email: 'john@example.com' }
  //   name: 'Jane'           // This updates the 'name' property to 'Jane'
  // });
  // Results in:
  // { name: 'Jane', email: 'john@example.com' }
  // exmample:
  /*
   return (
    <form>
      <input
        type="text"
        name="name"                    // this is the name inside [event.target.name]
        value={values.name}            //this is the value inside event.target.value. 
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange}
      />
    </form>
  );
  */

  const validateForm = () => {
    const { username, password } = values;//we created values object above with username and password
    if (username === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    } else if (password === "") {
      toast.error("Email and Password is required.", toastOptions);
      return false;
    }
    return true;
  };
  // validateForm: Checks if both username and password are provided. Shows an error toast if either field is empty.


  const handleSubmit = async (event) => {// This is a function that will be called when the user submits a form.
    event.preventDefault();
    if (validateForm()) {//This function checks if the form data (username and password) is valid. 
      const { username, password } = values;//we created values object above with username and password .This line extracts username and password from the values object, so we can use them directly.
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });
      if (data.status === false) {//data.status: This is a value returned by the server indicating whether the login was successful (true or false).
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );

        navigate("/");
      }
    }
  };

  // event.preventDefault();
      // event: This is the event object that gets passed to handleSubmit when the form is submitted. It contains information about the event.
      // preventDefault(): This method prevents the default form submission behavior, which would normally refresh the page. We use this to handle the form submission in JavaScript without reloading the page.
      
  // axios.post: This sends a POST request to the server. loginRoute is the URL endpoint where the server expects the login data.
  // await: This keyword waits for the server's response before continuing. It ensures the code doesn’t move on until the response is received.
  // data: This is the response from the server. We extract it using destructuring. It contains information about the server's response, like whether the login was successful.

//   When the server receives the login request (which includes the username and password), it checks the credentials to see if they match any existing user in the database. If they do, the server will send back a response that typically includes:
// User details (like username, email, user ID, etc.).
// Status of the login attempt (whether it was successful or not).
// data.user: This is the user object containing the details of the authenticated user. It could look like this:
// {
//   "id": "12345",
//   "username": "johndoe",
//   "email": "johndoe@example.com",
//   "avatar": "link_to_avatar_image",
//   "token": "some_authentication_token"
// }

  return (
    <>
      <FormContainer>
        <form action="" onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>vikichats</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            min="3"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Log In</button>
          <span>
            Don't have an account ? <Link to="/register">Create One.</Link>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
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
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
