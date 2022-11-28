import { createContext, useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { json } from "react-router-dom";
import usePersistedState from "../hooks/usePersistedState";
export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {

    const { user, isAuthenticated, isLoading } = useAuth0();

    const [allUsers, setAllUsers] = useState(null);
    const [currentUser, setCurrentUser] = usePersistedState(null)
    
    const authUser = user
    // console.log(user)


    //Get all users
    
    // get Current User
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
                    console.log(res)
                    if (res.status === 400) {
                        fetch(`/api/get-user/${user.sub}`)
                        .then(res => res.json())
                        .then(res => {
                            console.log(res)
                            setCurrentUser(res.data)
                        })
                    }
                    if (res.status === 200) {
                        setCurrentUser(res.data)
                    }

                } )
                     
    }, [user])

    useEffect(() => {
        fetch("/api/get-users")
        .then(res => res.json())
        .then(res => setAllUsers(res.data))
        
    }, [user])




    console.log(currentUser)



    return (
        <CurrentUserContext.Provider
            value={{
                authUser,
                currentUser,
            }}
        >
            {children}
        </CurrentUserContext.Provider>
    )
}