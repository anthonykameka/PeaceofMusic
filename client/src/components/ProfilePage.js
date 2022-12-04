import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CurrentUserContext } from "./CurrentUserContext";
import styled from "styled-components";
import SubHeader from "./SubHeader";
import ProfileInfo from "./ProfileInfo";
import GlobalStyles from "./GlobalStyles";
import Modal from "styled-react-modal"
import FocusLock from "react-focus-lock";
import { useParams } from "react-router-dom";
import { MusicContext } from "./MusicContext";


const HomePage = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    
    const params = useParams();
    // console.log(params)
    const profileID = params.id
    console.log(profileID)
    const {
        currentUser,

    } = useContext(CurrentUserContext)



    const [thisUser, setThisUser] = useState(null)
    const [profileData, setProfileData] = useState(null)

    useEffect(() => {
        console.log("test")
        fetch(`/api/get-this-user/${profileID}`)
        .then(res => res.json())
        .then(res => {
            console.log(res.data)
            setProfileData(res.data)
            
            
        })
     }, [])

   // console.log(currentUser)


    useEffect(() => {
        fetch(`/api/get-user/${user.sub}`)
        .then(res => res.json())
        .then(res => {
            setThisUser(res.data)
        })
    }, [])
    


    const size = {
        width: '100%',
        height: 300,
      };
      const view = 'list'; // or 'coverart'
      const theme = 'black'; // or 'white'
      

    

    if (isLoading) {
        return <div>Loading ...</div>;
    }


    let favorites = null;
    let currentUserMatch = false;
    if (!params.id) {
        favorites = currentUser.favorites
        currentUserMatch=true
    }
    
    
   else if (currentUser?._id === profileData?._id) {
        favorites = currentUser.favorites
        currentUserMatch=true
    }
    else {
        currentUserMatch=false
        favorites=profileData.favorites
    }

    return (
        isAuthenticated && (
        <Wrapper>
            
            <Content>
            <SubHeader/>
            <FavoritesWrapper>
                <Favorites>
                    <Favorite></Favorite>
                </Favorites>
            </FavoritesWrapper>
            {
                !currentUser? <h1>LOADING CIRCLE....</h1>
                :
                <ProfileInfo profileID={profileID} profileData={profileData} params={params} />
            }
            {/* <YoutubePlayer videoId="m1a_GqJf02M"/>  */}
            </Content>

        </Wrapper>
        )
    );
    };

    const FavoritesWrapper = styled.div`
    display: flex;
    flex-direction: column;

    `
    const Favorites = styled.ul``

    const Favorite = styled.li`
    display: flex;
    align-items: center;
    justify-content: center;
    `
    
    const Content = styled.div`
    display:flex;
    margin-left: auto;
    width: 100%;
    justify-content: end;
    background-color: var(--color-dark-grey);
    overflow: auto;

    `


    const Wrapper = styled.div`
    width: 100vw;
    display:flex;
    flex-direction: column;

    margin-left: auto;

    `



    export default HomePage;