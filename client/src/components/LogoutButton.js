import { useAuth0 } from "@auth0/auth0-react";
import { RiLogoutCircleLine} from "react-icons/ri";
import React from "react";

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <>
        <RiLogoutCircleLine  size={25} onClick={() => logout({ returnTo: window.location.origin })}>
        </RiLogoutCircleLine>
        </>
    );
};

export default LogoutButton;