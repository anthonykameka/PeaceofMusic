import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { RiLoginCircleFill } from "react-icons/ri";
import styled from "styled-components";
import React from "react";
// login with redirect option from auth0
const LoginButton = () => {

  const navigate = useNavigate();
  const { loginWithRedirect, loginWithPopup } = useAuth0();

  const handleClick = () => {
    loginWithRedirect()
    navigate("/home")
  }

  return <Button  onClick={() => {handleClick()}}>Log In/Sign Up</Button>;
};

const Button = styled.button`
width: 700px;
font-size: 40px;
position: absolute;
height: 100px;
background: linear-gradient( 45deg, var(--color-deepteal), var(--color-darkpurple), var(--color-orange));
right:-200px;
font-family: 'Inconsolata', monospace;

`


export default LoginButton;