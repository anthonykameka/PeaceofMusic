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
    console.log(ev.target.innerText)
    const thisArtistData = artistsData.filter(artist => {
      return artist.artistName === ev.target.innerText
    })

    console.log(thisArtistData)
  }

  return (
    <ArtistList>
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

const Artist = styled.li`
color: white;
&:hover{
  color: #bc35ca;
  cursor: pointer;
}

font-size: 20px;
`

const ArtistList = styled.ul`
 columns: 3;
 margin-top: 10px;
 margin-bottom: 10px;
 margin-left: 10px;
`

export default Artists