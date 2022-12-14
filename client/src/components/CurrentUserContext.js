import { createContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { json } from "react-router-dom";
import usePersistedState from "../hooks/usePersistedState";
export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {

    const { user, isAuthenticated, isLoading } = useAuth0();

    const [allUsers, setAllUsers] = useState(null);
    const [currentUser, setCurrentUser] = usePersistedState(null)
    const [refreshUser, setRefreshUser] = useState(0)
    
    const authUser = user
    // console.log(user)


    //Get all users
    
    // get Current User
    // if current user not found in database, create a default profile.
    useEffect(() => {
        user && fetch("/api/add-user", {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({user})
                })
                .then(res => res.json())
                .then(res => {
                    //console.log(res)
                    if (res.status === 400) {
                        fetch(`/api/get-user/${user.sub}`)
                        .then(res => res.json())
                        .then(res => {
                           
                            setCurrentUser(res.data)
                            
                            if (res.data.active === false) {
                                //console.log("test")
                                fetch(`/api/activate-user/${res.data._id}`,
                                {
                                    method: "PATCH",
                                })
                                .then(res => res.json())
                                .then(res => {
                                    
    
                                })
                            }
                        })
                    }
                    if (res.status === 200) {
                        setCurrentUser(res.data)

                    }

                } )
                     
    }, [user, setRefreshUser, refreshUser])

    useEffect(() => {
        fetch("/api/get-users")
        .then(res => res.json())
        .then(res => setAllUsers(res.data))
        
    }, [])



    // review approval
    let reviewer = false;
    if (currentUser?.role === "founder" || currentUser?.role === "admin" || currentUser?.role === "moderator") {
        reviewer = true;
    }


    return (
        <CurrentUserContext.Provider
            value={{
                authUser, //auth0 info where required
                currentUser, // current user details
                refreshUser,// used to refreshUser after an action
                allUsers, // all users
                setRefreshUser, // used to refreshUser after an action
                reviewer, // reviewer status depending on site role
            }}
        >
            {children}
        </CurrentUserContext.Provider>
    )
}