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

    // initializing values
    const navigate = useNavigate()
    const { user, isAuthenticated, isLoading } = useAuth0();
    const params = useParams();
    const profileID = params.id
    const {
        currentUser,
    } = useContext(CurrentUserContext)

    const {
        songs,
        featured,
    } = useContext(MusicContext)

    console.log(featured)



    const [thisUser, setThisUser] = useState(null)
    const [profileData, setProfileData] = useState(null)


    // profile page
    useEffect(() => {

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

 // get user info
    useEffect(() => {
        fetch(`/api/get-user/${user.sub}`)
        .then(res => res.json())
        .then(res => {
            setThisUser(res.data)
        })
    }, [])
    


      

    

    if (isLoading) {
        return <div>Loading ...</div>;
    }
 
    // favoritesong list logic.
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

    // find those songs by id within database

    let favoriteSongs = songs?.filter(song => favorites?.includes(song._id))

    // go to song when clicked
  const handleSongClick = (songId) => {

    navigate(`/songs/${songId}`)
  }

  /// get random features
    



    // console.log(selected)

    return (
        isAuthenticated && (
        <Wrapper>
            
            <Content>
            
            {
                !favoriteSongs? <></>
                :
            
            <FavoritesWrapper>
                <SubHeader/>
                <FavoritesFeatured>
                    {
                        featured?
                    
                    <Featured>
                    {
                        !featured?<></>
                        : 
                        
                            featured?.map(song => {
                                return (
                                    <FeaturedSong>
                                        <FeaturedAlbum src={song.thisSong.albumArt}/>
                                        <FeaturedArtist>{song.artistName}</FeaturedArtist>
                                        <FeaturedSongTitle>{song.songTitle}</FeaturedSongTitle>
                                    </FeaturedSong>
                                )
                            })

                            
                        }
                    
                    </Featured>
                    :
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
                }
                </FavoritesFeatured>
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

    const FeaturedSong = styled.div`

    max-height: 250px;
    padding: 20px;
    max-width: 200px;

    `

    const FeaturedAlbum = styled.img`
    width: 150px;



    `

    const FeaturedSongTitle = styled.p`
    word-wrap:wrap;
    `

    const FeaturedArtist = styled.h2`
    `

    const Featured = styled.div`
    display:flex;
    grid-template-columns: 1fr;
    padding: 0.8em;
    flex-wrap: wrap;
    margin-left: 10px;
    
    height: 700px;

    `

    const FavoritesFeatured = styled.div`
    `

    const ArtistName = styled.div`
    `
    const Song = styled.a`
    word-wrap:wrap;
    
    `   
    const Artist = styled.h2`
    `

    const AlbumArt = styled.img`
    width: 150px;
    
    `

    const FavoritesWrapper = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    width: 80vw;

    `
    const Favorites = styled.div`
    display:flex;
    grid-template-columns: 1fr;
    padding: 0.8em;
    flex-wrap: wrap;
    margin-left: 10px;
    
    height: 700px;


    `

    const Favorite = styled.div`
    max-height: 250px;
    padding: 20px;
    max-width: 200px;
    &:hover {
        cursor: pointer;
        color: var(--color-darkpurple)
    }
    
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