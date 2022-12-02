import React, { useEffect, useState, useContext , useRef} from 'react'
import styled from 'styled-components'
import GlobalStyles from './GlobalStyles'
import { useParams } from 'react-router-dom'
import { CurrentUserContext } from './CurrentUserContext'
import PomEditor from './TextEditor/PomEditor'


const PeaceOfMusic = () => {

    const [song, setSong] = useState(null)
    const [music, setMusic] = useState(null)
    const [splitWords, setSplitWords] = useState(null)
    const [splitLines, setSplitLines] = useState(null)
    const [keys, setKeys] = useState(null)

    const songId = useParams().songId;


    const {
        currentUser
    } = useContext(CurrentUserContext)


    useEffect(() => {
        fetch(`/api/get-song/${songId}`)
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

    const selection = useRef('');
    const text = document.getSelection().toString();
        
    const handleSelection = () => {
      
      if (text) {
        selection.current = text;
      }
     }
        
     useEffect(() => {
        console.log(text)
     }, [text])



 const lineSeparator = (text) => {
    const array = text.split("\n")
    return array
    
 }
// each word is separated into syllables. 
// the word"some" is not captured in the main method. 
// someCount is a means to get around this.
 const syllableSeparator = (word) => {
    word = word.toLowerCase();
    let someCount = 0;
    if(word.length > 3)
    {
        if(word.substring(0, 4)=="some")
        {
            word = word.replace("some", "")
            someCount++
        }
    }
    word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '');  
    word = word.replace(/^y/, '');   
      //return word.match(/[aeiouy]{1,2}/g).length;   
      let syl = word.match(/[aeiouy]{1,2}/g); 
      console.log(syl);
      if(syl)
      {
          //console.log(syl);
          return syl.length+someCount;
      }

 }

 const handleEditClick = () => {
    console.log("hi")

    
 }





// console.log(splitLines)

const handleWordClick = (line, word) => {
    console.log(line, word)
}

console.log(keys)
const selectionHandler = (ev) => {
    ev.preventDefault()
    let text = window.getSelection().toString();
    console.log(text)
}



  return (
    <Wrapper >
        <SubHeader>
            <Annotate onClick = {selectionHandler}>
            Add Annotation to your selection
            </Annotate>
        </SubHeader>
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
            <Edit onClick={handleEditClick}>Edit the lyrics or spacing? You may also add a character(s) ie: " - "  for instrumental sections where there are no word </Edit>
            <TitleBox> 
                <Info>{}</Info>

            </TitleBox>
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
                            const syllable = syllableSeparator(word)
                            return (
                                <Word onClick={() => handleWordClick(l, w)}> {word} </Word>
                            )
                        })
                    }</p>)})


                   


                   : <></>
                }
            
            </Lyrics>
        </LyricsWrapper>
        <EditorWrapper>
            <EditorSubWrapper>
                <PomEditor/>
            </EditorSubWrapper>
        </EditorWrapper>
        
    </Wrapper>
  )
}

const Annotate = styled.button`
color: var(--color-deepteal);
`

const SubHeader = styled.div`
`

const EditorSubWrapper = styled.div`
width: 600px;
border: 1px solid white;
height: 700px;
`

const EditorWrapper = styled.div`
`

const Info = styled.p`
`

const TitleBox = styled.div`
display:flex;
flex-direction: column;
`

const Edit = styled.h2`
`

const Key = styled.li`
`

const KeySelector = styled.ul`
display: flex;
`
const DoYou = styled.h2`
`
const KeyBox = styled.div``

const Word = styled.span`
color: var(--color-deepteal);
&:hover {
color: var(--color-orange)
}`

const Lyrics = styled.p`
white-space: pre-wrap;
margin-left: 300px;
margin-top: 100px;
line-height: 50px;

`

const LyricsWrapper = styled.div`
height: 100vh;

`

const Wrapper = styled.div`
display:flex;
flex-direction: column;
align-items: center;
`

export default PeaceOfMusic