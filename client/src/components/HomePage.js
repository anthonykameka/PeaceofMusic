import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CurrentUserContext } from "./CurrentUserContext";
import styled from "styled-components";
import pomme1 from "../assets/pommes/pomme1.png"
import pomme2 from "../assets/pommes/pomme2.png"
import pomme3 from "../assets/pommes/pomme3.png"
import pomme4 from "../assets/pommes/pomme4.png"
import pomme5 from "../assets/pommes/pomme5.png"
import pomme6 from "../assets/pommes/pomme6.png"
import SubHeader from "./SubHeader";
import PomEditor from "./TextEditor/PomEditor"
import ProfileInfo from "./ProfileInfo";
import YoutubePlayer from "./YouTubePlayer";
import GlobalStyles from "./GlobalStyles";



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
    background-color: var(--color-orange);
    overflow: auto;

    `


    const Wrapper = styled.div`
    width: 100vw;
    display:flex;
    flex-direction: column;

    margin-left: auto;

    `



    export default HomePage;