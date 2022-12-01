import React from 'react'
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';

import { MusicContext } from './MusicContext';
import logo from '../assets/logo1.png'
import logoText from '../assets/logotext.png'
import { BsJournals } from "react-icons/bs"
import {GiMusicalScore} from "react-icons/gi"
import { CurrentUserContext } from './CurrentUserContext';
import UserPanel from './UserPanel';
import AddASong from './AddASong';

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
    navigate("/profile")
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

  return (
    <Wrapper>
      {/* <Logo src={logo} onClick={handleLogoClick}></Logo> */}
      <LeftBox>
        <LogoText onClick={handleLogoClick} src={logoText}/>
        <Buttons>
        <AddASong/>
        <Artists onClick={handleArtistsClick}>Artists</Artists>
      <Songs onClick={handleSongs}>songs</Songs>
      <AllEdits onClick={handleEditsClick} > all edits</AllEdits>
      </Buttons>
      </LeftBox>

        <Nav>
        
        <BsJournals onClick={handleJournalClick} style={{"margin-top": "10px"}}size={25}/>
        <GiMusicalScore onClick={handleMusicClick}style={{"margin-top": "10px"}}size={25}/>
        <LoginButton/>
        <LogoutButton/>
        
        </Nav>
        <UserPanel/>
    </Wrapper>
  )
}

const Buttons = styled.div`
display:flex;
justify-content: space-between;
button {
  margin-left: 10px;
}
`

const LeftBox = styled.div`
display:flex;
flex-direction: column;

`
const AllEdits = styled.button``
const LogoText = styled.img``



const Artists = styled.button``

const Logo = styled.img`
width: 200px;
`








const Wrapper = styled.div`
height: 200px;
display: flex;
align-items: end;
padding-bottom: 10px;
position: relative;
background-color: var(--color-deepteal);
`

const Songs = styled.button`
`

const Nav = styled.nav``

export default Header;