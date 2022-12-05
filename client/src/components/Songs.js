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




  return (
    <>
    <AllSongs>All Songs</AllSongs>
    <ArtistList>
      {
        artistsData?.map(artist => {
          const artistName = artist.artistName
        


          return (
            <ArtistCard artist={artistName} data={artist}/>
          )
        })
      }
    </ArtistList>
    </>
  )
}


const AllSongs = styled.p`
  margin: 0;
  color: var(--color-orange);
  font-size: 50px;
  left: 82px;
  top: 210px;
  position: absolute;
  padding: 0;`


const ArtistList = styled.ul`
    display:flex;
    grid-template-columns: 1fr;
    padding: 0.8em;
    margin-top: 60px;
    flex-wrap: wrap;
    margin-left: 10px;
`

export default Songs