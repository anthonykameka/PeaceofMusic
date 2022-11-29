import React from 'react'
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import { useNavigate } from 'react-router-dom';
import Modal, {ModalProvider} from "styled-react-modal";
import FocusLock from "react-focus-lock"
import { useState, useContext } from 'react';
import {getSong} from"genius-lyrics-api";
import { MusicContext } from './MusicContext';
import logo from '../assets/logosmall2.png'
import { BsJournals } from "react-icons/bs"
import {GiMusicalScore} from "react-icons/gi"
import { CurrentUserContext } from './CurrentUserContext';
import UserPanel from './UserPanel';

const Header = () => {
//CONTEXT VARIABLES

const {
  currentUser, // current logged in user (from MONGODB)
  setRefreshUser,
  refreshUser,
  
} = useContext(CurrentUserContext)

  const {
    setRefreshSongs, refreshSongs //dependency for the getSongs fetch. Adding song will cause dependent data to refresh
  } = useContext(MusicContext)




  const [songSearch, setSongSearch] = useState(null) // initialize
  const [artistSearch, setArtistSearch] = useState(null) // initialize.
  const [song, setSong] = useState(null) // initialize


  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // initialize modal state
   //function to toggle modal
  const toggleModal = () => {

    setIsOpen(!isOpen)
}

        // go to song list from our database

  const handleSongs = () => {
    navigate("/songs")
  }
// handle AddSong
  const handleAddSong = () => {
    toggleModal()

  }

  const handleSearch = (ev) => { 
    ev.preventDefault();
    //these options are required for GENIUS API/NPM package // use inputs to search api
    const options = {
      apiKey: "mPaybTjlCGUYikeRswTWOEU57Pf-vXKk6WrAttu0ue344TFuamLsUzn7p9GgXe3p",
      title: songSearch,
      artist: artistSearch,
      optimizeQuery:true
  }

  // console.log(options)
  console.log(currentUser)
  

    getSong(options).then((song) => {
      
      const thisSong = {...song, addedBy: currentUser._id}// retain user information to keep track on who is adding // stats tend to engage the user
      fetch("/api/add-song" , { 
          method: "POST",
          headers: {
              "Accept": "application/json",
              "Content-type": "application/json"
          },
          body: JSON.stringify({thisSong})
      })
      .then(res => res.json())
      .then(res => {
          console.log(res)
          if (res.status === 200) {
            setRefreshSongs(refreshSongs+1)
            setRefreshUser(refreshUser+1)
          }
      })
    })

    toggleModal()
  }

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

  const handleCancelClick = (ev) => {
    ev.preventDefault();
    toggleModal()
  }

  return (
    <Wrapper>
      <UserPanel/>
        <Nav>
        <Logo src={logo} onClick={handleLogoClick}></Logo>
        <BsJournals onClick={handleJournalClick} style={{"margin-top": "10px"}}size={25}/>
        <GiMusicalScore onClick={handleMusicClick}style={{"margin-top": "10px"}}size={25}/>
        <LoginButton/>
        <LogoutButton/>
        <Artists onClick={handleArtistsClick}>Artists</Artists>
        <Songs onClick={handleSongs}>songs</Songs>
        <AddSong onClick={handleAddSong}>add song</AddSong>
        <EditSong>edit song</EditSong>
        <Modal
            isOpen={isOpen}
            onEscapeKeydown={toggleModal}
            role="dialog"
            aria-modal={true}
            aria-labelledby="modal-label"
            transparent={true}
            >
          <FocusLock>
            <Form>
            <Label>Song Name</Label>
            <SongInput onChange={(e)=> setSongSearch(e.target.value)}></SongInput>
            <Label>Artist Name</Label>
            <ArtistInput onChange={(e)=> setArtistSearch(e.target.value)}></ArtistInput>
            <Submit onClick={handleSearch}>Search</Submit>
            <Cancel onClick ={handleCancelClick}>Cancel</Cancel>
            </Form>
          </FocusLock>

        </Modal>
        </Nav>
        
    </Wrapper>
  )
}

const Cancel = styled.button``

const EditSong = styled.button``

const Artists = styled.button``

const Logo = styled.img`
width: 75px;
`
const Submit = styled.button``
const Form = styled.form`
`

const AddSong = styled.button`
`

const Label = styled.label`
`

const ArtistInput = styled.input`
`

const SongInput = styled.input`
`

const Wrapper = styled.div`
height: 200px;
display: flex;

background-color: var(--color-deepteal);
`

const Songs = styled.button`
`

const Nav = styled.nav``

export default Header;