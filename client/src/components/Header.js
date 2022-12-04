import React from 'react'
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';

import { MusicContext } from './MusicContext';
// import logo from '../assets/logo1.png'
// import logoText from '../assets/logotext.png'
// import { BsJournals } from "react-icons/bs"
// import {GiMusicalScore} from "react-icons/gi"
import { CurrentUserContext } from './CurrentUserContext';
import UserPanel from './UserPanel';
import AddASong from './AddASong';
import newLogo from "../assets/POMbackgroundtiny.png"
import SearchBar from "./SearchBar"

const Header = () => {
//CONTEXT VARIABLES

const {
  currentUser, // current logged in user (from MONGODB)
  setRefreshUser,
  refreshUser,
  
} = useContext(CurrentUserContext)




  const navigate = useNavigate();
  
 

        // go to song list from our database

  const handleSongs = () => {
    navigate("/songs")
  }
// handle AddSong
  

  
  const handleLogoClick = (ev) => {
    ev.preventDefault();
    navigate("/home")
  }

  const handleJournalClick = (ev) => {
    ev.preventDefault();
    navigate(`/journal/${currentUser?.username.slice(1)}`)
  }

  const handleMusicClick = (ev) => {
    ev.preventDefault();
    navigate(`/transcribe/${currentUser?.username.slice(1)}`)
  }


  const handleArtistsClick = (ev) => {
    ev.preventDefault();
    navigate(`/artists`)
  }


  const handleEditsClick = (ev) => {
    ev.preventDefault();
    navigate("/edits")
  }

  /// function below is used to update all songs where required
  const handleUpdateAll = (ev) => {
    ev.preventDefault();
    fetch("/api/update-songs")
    .then(res => res.json())
    .then(res => {
        console.log(res)
    })
  }
  

  return (
    <Wrapper>
      {/* <Logo src={logo} onClick={handleLogoClick}></Logo> */}
      <NewLogo style={{marginBottom: "-10px"}}
        onClick={handleLogoClick} 
        src={newLogo}/>
        <SearchBar/>
      <LeftBox>
      <ButtonsAndSearch>
        <Buttons>
          
          <Artists onClick={handleArtistsClick}>Artists</Artists>
        <Songs onClick={handleSongs}>Songs</Songs>
        <AddASong/>
        {
          currentUser?.role === "founder"?
          <AllEdits onClick={handleEditsClick} > all edits</AllEdits>
          : <></>
        }
        
        {/* <LogoutButton/> */}
        </Buttons>
        
      </ButtonsAndSearch>
      </LeftBox>

        <Nav>
        
        {/* <BsJournals onClick={handleJournalClick} style={{"margin-top": "10px"}}size={25}/>
        <GiMusicalScore onClick={handleMusicClick}style={{"margin-top": "10px"}}size={25}/> */}
        {/* <LoginButton/>
        <LogoutButton/> */}
        {/* <Artists onClick={handleUpdateAll}>update all songs</Artists> */}
        
        </Nav>
        
       

        <UserPanel/>
    </Wrapper>
  )
}

const ButtonsAndSearch = styled.div`
display: flex;
`

const Buttons = styled.div`
display:flex;
width: 300px;
margin-left: 800px;
justify-content: space-between;
button {
  margin-left: 10px;
  width: 130px;
  background-color: none !important;
  &:hover {
    color: white
  }
  &:focus {
    color: white
  }
}
`

const LeftBox = styled.div`
display:flex;
flex-direction: column;

`
const AllEdits = styled.button``
const NewLogo = styled.img`
height: 200px;
`



const Artists = styled.button``

const Logo = styled.img`
width: 200px;
`








const Wrapper = styled.div`
height: 200px;
display: flex;
justify-content: space-between;
align-items: end;
padding-bottom: 10px;
border-bottom: 1px solid var(--color-darkpurple);
position: relative;
background-color: var(--color-darkgrey);
button {
  color: var(--color-deepteal);

  &:hover {
    color: var(--color-darkpurple)
  }
}
`

const Songs = styled.button`
`

const Nav = styled.nav``

export default Header;