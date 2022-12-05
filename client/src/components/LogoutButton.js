import { useAuth0 } from "@auth0/auth0-react";
import { RiLogoutCircleLine} from "react-icons/ri";
import styled
 from "styled-components";
import React from "react";
// logout with redirect option from auth0
const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <>
        <Button onClick={() => logout({ returnTo: window.location.origin })}>Log Out
        </Button>
        </>
    );
};

const Button = styled.button``

export default LogoutButton;