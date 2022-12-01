import React from 'react'
import styled from "styled-components"
import { useNavigate } from 'react-router-dom'
const SongPoms = ({ song }) => {

const navigate = useNavigate()
const handlePomClick = (ev) => {
    ev.preventDefault();
    navigate("/pom")
}
console.log(song)

  return (
    <Wrapper> 
        <PomList>
            <PomCard onClick={handlePomClick} song={song}>hi</PomCard>
        </PomList>
    </Wrapper>
  )
}

const Wrapper = styled.div`
display: flex;

`

const PomList = styled.ul`
`

const PomCard = styled.li``

export default SongPoms