import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CurrentUserContext } from "./CurrentUserContext";
import styled from "styled-components";
import SubHeader from "./SubHeader";
import ProfileInfo from "./ProfileInfo";
import GlobalStyles from "./GlobalStyles";
import Modal from "styled-react-modal"
import FocusLock from "react-focus-lock";



const HomePage = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    

    const {
        currentUser,
    } = useContext(CurrentUserContext)

    const [thisUser, setThisUser] = useState(null)

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

    return (
        isAuthenticated && (
        <Wrapper>
            <
            <Content>
            <SubHeader />
            {
                !currentUser? <h1>LOADING CIRCLE....</h1>
                :
                <ProfileInfo/>
            }
            {/* <YoutubePlayer videoId="m1a_GqJf02M"/>  */}
            </Content>

        </Wrapper>
        )
    );
    };

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