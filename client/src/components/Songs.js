import React from 'react'
import { useContext } from 'react'
import { MusicContext } from './MusicContext'
import ArtistCard from "./ArtistCard"
import styled from 'styled-components'

function Songs() {

  const {
    artists,
    artistsData
  } = useContext(MusicContext)


console.log(artistsData)


  return (
    <ArtistList>
      {
        artistsData.map(artist => {
          const artistName = artist.artistName
        


          return (
            <ArtistCard artist={artistName} data={artist}/>
          )
        })
      }
    </ArtistList>
  )
}

const ArtistList = styled.ul`
 columns: ;
`

export default Songs