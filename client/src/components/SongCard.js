import React from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
const SongCard = ({song}) => {

  const navigate = useNavigate();

  const handleSongClick = (e) => {
    e.preventDefault();
    navigate(`/songs/${song._id}`)
  }

  return (
    <SongItem onClick={handleSongClick}>
        <SongBox>
            <AlbumArt src={song?.thisSong.albumArt}/>
            <InfoBox>
                <ArtistName>{song?.artistName}</ArtistName>
                <SongName>{song?.songTitle}</SongName>
            </InfoBox>
        </SongBox>
    </SongItem>
  )
}

const InfoBox = styled.div`
display:flex;
flex-direction: column;`

const SongName = styled.p`

`
const ArtistName = styled.p`
font-weight: bold;

`
const SongBox = styled.div`
display:flex;`

const AlbumArt = styled.img`
width: 100px;`

const SongItem = styled.li`

`

export default SongCard