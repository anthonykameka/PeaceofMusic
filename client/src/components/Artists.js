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
        artists.map(artist => {
          return ( 
            <Artist><a onClick={handleArtistClick}>{artist}</a></Artist>
          )
        })
      }
    </ArtistList>
  )
}

const Artist = styled.li`
`

const ArtistList = styled.ul``

export default Artists