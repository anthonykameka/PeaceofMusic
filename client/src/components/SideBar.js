import React, { useContext } from 'react'
import logo from '../assets/logosmall2.png'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import LoginButton from './LoginButton'
import LogoutButton from './LogoutButton'
import { BsJournals } from "react-icons/bs"
import {GiMusicalScore} from "react-icons/gi"
import { CurrentUserContext } from './CurrentUserContext'

const SideBar = () => {

    const {currentUser} = useContext(CurrentUserContext)

    const navigate = useNavigate();

    const handleLogoClick = (ev) => {
        ev.preventDefault();
        navigate("/profile")
    }

    const handleJournalClick = (ev) => {
      ev.preventDefault();
      navigate(`/journal/${currentUser.username.slice(1)}`)
    }

    const handleMusicClick = (ev) => {
      ev.preventDefault();
      navigate(`/transcribe/${currentUser.username.slice(1)}`)
    }

  return (
    <Wrapper>
        <Logo src={logo} onClick={handleLogoClick}></Logo>
        <LogoutButton/>
        <BsJournals onClick={handleJournalClick} style={{"margin-top": "10px"}}size={25}/>
        <GiMusicalScore onClick={handleMusicClick}style={{"margin-top": "10px"}}size={25}/>
    </Wrapper>
  )
}

const Wrapper = styled.div`
position: absolute;
height: 100vh;
z-index: 222;
display: flex;
flex-direction: column;
align-items: center;
width: 4vw;
background-color: var(--color-orange);
display:none;
`

const Logo = styled.img`
width: 75px;
`

export default SideBar;