import React from 'react'
import { useContext } from 'react'
import { MusicContext } from './MusicContext'

function Artists() {

  const {
    artistsData,
    artists,
  } = useContext(MusicContext)

  console.log(artistsData)

  return (
    <div>Artists</div>
  )
}

export default Artists