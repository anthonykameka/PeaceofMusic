import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { RiLoginCircleFill } from "react-icons/ri";
import styled from "styled-components";
import React from "react";

const LoginButton = () => {

  const navigate = useNavigate();
  const { loginWithRedirect, loginWithPopup } = useAuth0();

  const handleClick = () => {
    loginWithRedirect()
    navigate("/home")
  }

  return <Button size={25} onClick={() => {handleClick()}}>Log In/Sign Up</Button>;
};

const Button = styled.button`
width: 400px;
font-size: 40px;

`


export default LoginButton;