import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'

const SongPage = () => {
    const _id = useParams()
    console.log(_id.id)

    const [song, setSong] = useState(null)

    useEffect(() => {
        fetch(`/api/get-song/${_id.id}`)
        .then(res => res.json())
        .then(res =>  {
            setSong(res.data)
            console.log(res.data)
        })
    }, [])

    console.log(song)

  return (
    <Wrapper>
        <LyricsWrapper>
        <Lyrics>{song?.song.lyrics}</Lyrics>
        </LyricsWrapper>
    </Wrapper>
  )
}

const Lyrics = styled.p`
white-space: pre-wrap;`

const LyricsWrapper = styled.div`
width: 50vw;
margin: auto;

`
const Wrapper = styled.div``

export default SongPage