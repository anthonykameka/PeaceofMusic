import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { RiLoginCircleFill } from "react-icons/ri";
import React from "react";

const LoginButton = () => {

  const navigate = useNavigate();
  const { loginWithRedirect, loginWithPopup } = useAuth0();

  const handleClick = () => {
    loginWithRedirect()
    navigate("/home")
  }

  return <RiLoginCircleFill size={25} onClick={() => {handleClick()}}>Log In</RiLoginCircleFill>;
};


export default LoginButton;