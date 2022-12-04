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
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const navigate = useNavigate()
    const { user, isAuthenticated, isLoading } = useAuth0();
    const params = useParams();
    const profileID = params.id
    const {
        currentUser,
    } = useContext(CurrentUserContext)

    const {
        songs,
    } = useContext(MusicContext)



    const [thisUser, setThisUser] = useState(null)
    const [profileData, setProfileData] = useState(null)

    useEffect(() => {
        console.log("test")
        if (profileID) {
        fetch(`/api/get-this-user/${profileID}`)
        .then(res => res.json())
        .then(res => {
            console.log(res.data)
            setProfileData(res.data)
            
            
        })
    }
     }, [params, currentUser])

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
        favorites = currentUser?.favorites
        currentUserMatch=true
    }
    
    
   else if (currentUser?._id === profileData?._id) {
        favorites = currentUser?.favorites
        currentUserMatch=true
    }
    else {
        currentUserMatch=false
        favorites=profileData?.favorites
    }



    let favoriteSongs = songs?.filter(song => favorites?.includes(song._id))

    
  const handleSongClick = (songId) => {

    navigate(`/songs/${songId}`)
  }
    

    return (
        isAuthenticated && (
        <Wrapper>
            
            <Content>
            
            {
                !favoriteSongs? <></>
                :
            
            <FavoritesWrapper>
                <SubHeader/>
                <Favorites>
                   
                        {
                            favoriteSongs.map(favorite => {
                                console.log(favorite)
                                return (
                                    <Favorite>
                                        <AlbumArt src={favorite.thisSong.albumArt}/>
                                        <ArtistName>
                                            <Artist>
                                                {favorite.artistName}
                                            </Artist>
                                            <Song onClick={() => handleSongClick(favorite._id)} > 
                                                {favorite.songTitle}
                                            </Song>
                                        </ArtistName>
                                    </Favorite>
                                )
                            })
                        }
                    
                </Favorites>
            </FavoritesWrapper>
            }
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

    const ArtistName = styled.div`
    `
    const Song = styled.a`
    
    `   
    const Artist = styled.h2`
    `

    const AlbumArt = styled.img`
    width: 100px;
    
    `

    const FavoritesWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    width: 80vw;

    `
    const Favorites = styled.ul`
    
    display:flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: flex-start;


    `

    const Favorite = styled.li`
    display: flex;
    
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