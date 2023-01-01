import React from 'react'
import styled from "styled-components"
import { useNavigate } from 'react-router-dom'
const SongPoms = ({ song }) => {
 
const navigate = useNavigate()
const handlePomClick = (ev) => {
    ev.preventDefault();
    navigate(`/pom/${song._id}`)
}

const handleTestClick = (ev) => {
    ev.preventDefault();
    navigate(`/poms/${song._id}`)
}

const handle3Click = (ev) => {
  ev.preventDefault();
  navigate(`/pom2/${song._id}`)
}


  return (
    <Wrapper> 
        <PomList>
            <PomCard onClick={handlePomClick} song={song}>Peace Of Music</PomCard>
            <PomCard onClick={handleTestClick} song={song}>Version 2</PomCard>
            <PomCard onClick={handle3Click} song={song}>Version 3</PomCard>
        </PomList>
    </Wrapper>
  )
}

const Wrapper = styled.div`
display: flex;

`

const PomList = styled.ul`
`

const PomCard = styled.button`
display:flex;
margin-top: 22px;
justify-content: center;
font-size: 20px;;
margin-right: 30px !important;
background: linear-gradient(var(--color-deepteal), var(--color-darkpurple));

`

export default SongPoms