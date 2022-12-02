import React, { useEffect } from 'react'
import styled from 'styled-components'


const Spotify = () => {


  let SPOTIFYID="0c4375e9d0004b709b622113f1f9caf5"
  let SPOTIFYSECRET="e2f2a97e6f7e4aff9f70ccdd37f74d0c"

  useEffect(() => {

    let authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials&client_id=" + SPOTIFYID  + "&client_secret=" + SPOTIFYSECRET
    }
    fetch("http://accounts.spotify.com/api/token", authParameters)
    .then(res => res.json())
    .then(data => console.log(data))
  }, [])

  return (
    <Wrapper>

    </Wrapper>
  )
}
const Wrapper = styled.div``
export default Spotify