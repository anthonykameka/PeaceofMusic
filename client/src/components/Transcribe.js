import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {getSong} from"genius-lyrics-api";
const { apiKey } = process.env;
const Transcribe = () => {




    const [lyrics, setLyrics] = useState(null)
    const [song, setSong] = useState(null)

    const options = {
        apiKey: "mPaybTjlCGUYikeRswTWOEU57Pf-vXKk6WrAttu0ue344TFuamLsUzn7p9GgXe3p",
        title: "silver slumbers",
        artist: "windigo",
        optimizeQuery:true
    }

    
//     // getSong(options).then((song) => setSong(song) )
useEffect(() => {
    let pomSong = null
    console.log(pomSong)
    getSong(options).then((song) => {
        console.log(song)
        setSong(song)
        fetch("/api/add-song" , { 
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-type": "application/json"
            },
            body: JSON.stringify({song})
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
        })
    
    })

    
}, [])
//     // const lyricArray = lyrics?.split(" ")
//     // console.log(lyricArray)


    useEffect(() => {
        // 
        // getSong(options).then((song) => setSong(song) )
        fetch("/api/get-chords")
        .then(res => res.json())
        .then(res => {
            console.log(res)
        })
    }, [])
  return (
    <Wrapper>
        <LyricsWrapper>
        {/* <Lyrics>{lyrics}</Lyrics> */}
        <SongInfo></SongInfo>
        </LyricsWrapper>
    </Wrapper>
  )
}

const SongInfo = styled.p``
const Wrapper = styled.div`
display: flex;
justify-content: center;
margin-top: 10vh
`
const LyricsWrapper = styled.div`
width: 50vw;

`
const Lyrics = styled.p`
white-space: pre-wrap;`
export default Transcribe