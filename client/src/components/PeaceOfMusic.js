import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import GlobalStyles from './GlobalStyles'

const PeaceOfMusic = ({songId}) => {

    const [song, setSong] = useState(null)
    const [music, setMusic] = useState(null)
    const [splitWords, setSplitWords] = useState(null)
    const [splitLines, setSplitLines] = useState(null)
    const [keys, setKeys] = useState(null)

    useEffect(() => {
        fetch(`/api/get-song/2ccf4273-432a-4bf0-8e3e-04a752b66a5d`)
        .then(res => res.json())
        .then(res => {
            setSong(res.data)
            setSplitLines(lineSeparator(res.data.thisSong.lyrics))
        })
        fetch (`/api/get-chords`)
        .then(res => res.json())
        .then(res => {
            setMusic(res.data[0])
            setKeys(res.data[0].keys)

        })

    }, [])


 const lineSeparator = (text) => {
    const array = text.split("\n")
    return array
    
 }

// console.log(splitLines)

const handleWordClick = (line, word) => {
    console.log(line, word)
}

console.log(keys)


  return (
    <Wrapper>
        <KeyBox><DoYou>Do you know the key of this song?</DoYou>
        
        <KeySelector>
            {
                !keys? <></>
                : keys.map(key => {
                    return (
                        <Key>{key}</Key>
                    )
                })
            }

        </KeySelector>
        </KeyBox>
        <LyricsWrapper>
            <Lyrics className="help">
                {
                   song
                   ? 
                   splitLines.map((line, index)=> {

                    const l = index //line number
                    const words= line.split(" ")
                    return (
                        <p>
                        {words.map((word, index) => {
                            const w = index //word number
                            return (
                                <Word onClick={() => handleWordClick(l, w)}> {word} </Word>
                            )
                        })
                    }</p>)})


                   


                   : <></>
                }
            
            </Lyrics>
        </LyricsWrapper>
    </Wrapper>
  )
}

const Key = styled.li`
`

const KeySelector = styled.ul`
`
const DoYou = styled.h2`
`
const KeyBox = styled.div``

const Word = styled.span`
color: black;
&:hover {
color: var(--color-orange)
}`

const Lyrics = styled.p`
white-space: pre-wrap;
margin-left: 300px;
margin-top: 100px;
line-height: 50px;
border: 1px solid red;
`

const LyricsWrapper = styled.div`
height: 100vh;
border: 1px solid black;

`

const Wrapper = styled.div`
`

export default PeaceOfMusic