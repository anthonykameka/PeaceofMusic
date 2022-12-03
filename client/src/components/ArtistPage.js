import React from 'react'
import { useParams } from 'react-router-dom'
import { useContext } from 'react';
import { MusicContext } from './MusicContext';
import styled from "styled-components/"

const ArtistPage = () => {
    const params = useParams();
    const artistId = params.id
    console.log(artistId)

    const {
        songs,
        artists,
    } = useContext(MusicContext)


    console.log(songs.filter(song => song.artistId === artistId))

    const artistSongs = songs.filter(song => {
        return song.artistId === artistId
    }) 
    
    const artistPhotos = [] 


  return (
    <Wrapper>
        </Wrapper>
  )
}

const Wrapper = styled.div`
display:flex;`

export default ArtistPage