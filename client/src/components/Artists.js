import React from 'react'
import { useContext } from 'react'
import { MusicContext } from './MusicContext'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const Artists = () => {

  const navigate = useNavigate();

  const {
    artists,
    artistsData
  } = useContext(MusicContext)

  const handleArtistClick = (ev)=> {
    ev.preventDefault();
  

    const thisArtistData = artistsData.filter(artist => {
      return artist.artistName === ev.target.innerText

    })

    navigate(`/artist/${thisArtistData[0][0].artistId}`)
  }

  return (
    <ArtistList>
      <AllArtists>ALL ARTISTS</AllArtists>
      {
        artists?.map(artist => {
          return ( 
            <Artist><a onClick={handleArtistClick}>{artist}</a></Artist>
          )
        })
      }
    </ArtistList>
  )
}

const AllArtists = styled.p`
  margin: 0;
  color: var(--color-orange);
  font-size: 50px;
  padding: 0;`

const Artist = styled.li`
color: white;
line-height: 25px;
&:hover{
  color: #bc35ca;
  cursor: pointer;
}

font-size: 20px;
`

const ArtistList = styled.ul`
 columns: 3;
 margin-top: 25px;
 margin-bottom: 10px;
 margin-left: 40px;
`

export default Artists