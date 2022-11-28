import React, { useContext } from 'react'
import { MusicContext } from './MusicContext'
import SongCard from "./SongCard"
import styled from 'styled-components'
const Songs = () => {

    const {
        songs
    } = useContext(MusicContext)

  return (
    <SongList>
        {
            songs.map(song => {
                return (
                    <SongCard song={song}/>
                )
            })
        }
    </SongList>
  )
}

const SongList = styled.ul`
`

export default Songs