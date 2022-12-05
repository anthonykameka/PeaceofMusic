import React, { useEffect, useState, useContext , useRef} from 'react'
import styled from 'styled-components'
import GlobalStyles from './GlobalStyles'
import { useParams } from 'react-router-dom'
import { CurrentUserContext } from './CurrentUserContext'
import PomEditor from './TextEditor/PomEditor'
import SelectionHighlighter from "react-highlight-selection"
import Modal from 'styled-react-modal'
import FocusLock from 'react-focus-lock'

import { PeaceContext } from './PeaceContext'

/// WHAT IS A PEACE OF MUSIC??
// SIMPLY PUT... IT IS AN ATTEMPT TO CREATE A MUSICAL HUB FOR EVERY SONG IN EXISTENCE. CREATED BY THE USERS, FOR THE USERS.
// AS A MUSIC AND HISTORY LOVER, I ENVISION A SITE THAT REVOLVES AROUND THE ETHOS OF PEACE JOY AND ART.
// IN PARTICULAR, WHAT SETS THIS PARTICULAR WEBSITE FROM OTHER SIMILAR ONES SUCH AS (GENIUS,  SONGMEANINGS) IS THE COLLECTION OF MUSIC/LYRIC ANALYSIS/EDUCATION, BY THE USERS.
// ALSO, MUSIC TAB SITES TEND NOT TO TEACH, BUT ONLY SHOW HOW TO PLAY. AND ALTHOUGH THERE ARE BENEFITS, IT DOES NOT LEAD TO LEARNING IN AN EFFECTIVE WAY. 
// ALAS, THERE WERE CHALLENGES IN BEING ABLE TO PRESENT THE CHORD IMMEDIATELY ABOVE THE WORD USING DIVS AND MATRIX. 
// THIS FEATURE IS STILL PROGRESS. TIME WILLING, IT WOULD MAKE MORE SENSE TO PUT INPUTS ABOVE EACH WORD. AND PROCESS THE CHORD AFTER SUBMISSION.// 
// IDEALLY USER COULD COMMENT ON EACH POM(PEACE OF MUSIC ) and share them to the song hub. ONE SONG, ONE CENTRAL PAGE. SAME WITH ALBUM AND ARTIST.


const PeaceOfMusic = () => {

    const [song, setSong] = useState(null) // this particular songs information 
    const [splitWords, setSplitWords] = useState(null) // split words used later
    const [splitLines, setSplitLines] = useState(null) // split lines
    const [pickingChord, setPickingChord] = useState(false) // when user is picking chord
    const [chosenRoot, setChosenRoot] = useState(null) // Root Chord chosen (Prefix of chord. ie : C, D , F# etc)
    const [chosenSuffix, setChosenSuffix] = useState(null) // suffix of chord chosen (sus, dim maj7 etc)
    const [selectedWordIndex, setSelectedWordIndex] = useState(null) // index of the word being selected 

    const songId = useParams().songId; // params for the song 
    
    

    const {
        currentUser
    } = useContext(CurrentUserContext) // current user info
    const {
        music, keys
    } = useContext(PeaceContext) // info from music theory fetch

 ///get song information
    useEffect(() => {
        fetch(`/api/get-song/${songId}`)
        .then(res => res.json())
        .then(res => {
            setSong(res.data) 
            setSplitLines(lineSeparator(res.data.thisSong.lyrics)) })// split lines of the lyrics into  individual, arrays // useful for determining the word's location within the lyrics.

    }, [])

// similar to lyrics reference function, the user will highlight section for musical education.



 // line separator. split at new lines..
 const lineSeparator = (text) => {
    const array = text.split("\n")
    return array
    
 }




// split the keys array [array of 12 keys] // split to aid with the styling
const keysA = keys?.slice(0, 6) 
const keysB = keys?.slice(6,12)


// initialize a list of suffixes.
const suffixes = music?.suffixes




// word click.
//see the return of the component. // each word is given a line number and a word number within that that line. A matrix to save and recall //
// although the saving is not functional as of yet, it will aid in storing and analysing the harmonic data. The first word of a line uses the ONE chord. 67% of the time.

const handleWordClick = (line, word) => {
    setSelectedWordIndex([line, word])
    
    toggleModal()

}





const [isOpen, setIsOpen] = useState(false); // initialize modal state


   //function to toggle modal
  const toggleModal = () => {
    setIsOpen(!isOpen)
    
}
// once modal is open, record chord click
const handleChordClick = (ev) => {
    ev.preventDefault()
    setPickingChord(true)
    setChosenRoot(ev.target.innerText)
}
// suffix click
const handleSuffixClick = (ev) => {
    ev.preventDefault()
    setChosenSuffix(ev.target.innerText)
}

// handle OK click

const handleOK =(ev) => {
    ev.preventDefault()
    setPickingChord(false) // user is done picking chord

    

    const chosenChord = (chosenRoot+chosenSuffix) // attach prefix and suffix together.
    const indexAndChord = [chosenRoot+chosenSuffix, selectedWordIndex] //unused at this time.
    const thisWord = selectedWordIndex[1] // get Word, within line
    const thisLine = selectedWordIndex[0] // get Line, within lyrics
    const element = document.getElementById(`${thisWord}-${thisLine}-c`) // find the element by id that matches corresponding matrix value.

    element.innerText = `${chosenChord}` // the element which is above the chosen word, is given text
    setSelectedWordIndex(null) // reset everything
    setChosenRoot("")
    setChosenSuffix("")
    
    toggleModal()
}
// HANDLE NO CHORD
const handleNC = (ev) => {
    ev.preventDefault()
    setPickingChord(false) //toggle off
    
    const thisWord = selectedWordIndex[1] // get the index of word and line, similar to the OK function

    const thisLine = selectedWordIndex[0]
    const element = document.getElementById(`${thisWord}-${thisLine}-c`) // -c is the chord display, which are empty spaces above each word.
    const element2 = document.getElementById(`${thisWord}-${thisLine}`)
    const wordLength = element2.innerText.length // word length
    const chosenChord = ("-".repeat(wordLength))
    element.innerText = `${chosenChord}`
    setSelectedWordIndex(null)
    setChosenRoot("")
    setChosenSuffix("")
    
    toggleModal()

}


    const emptySpaceClick = (ev) => {
        ev.preventDefault();
    }





  return (
    <Wrapper >
                <SongInfoBox>
        <SongInfoSubBox>
          <AlbumCover src={song?.thisSong.albumArt}/>
          <Title>{song?.songTitle}</Title>
          <Title><span>{song?.artistName}</span></Title>

        </SongInfoSubBox>
       
      </SongInfoBox>
        <SubHeader>

        </SubHeader>
       
        <LyricsWrapper>
            {/* <Edit onClick={handleEditClick}>Edit the lyrics or spacing? You may also add a character(s) ie: " - "  for instrumental sections where there are no word </Edit> */}
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
                        <div>
                            <p>
                                {
                                    words.map((word, index) => {
                                    const w = index //word number
                                    return (
                                        <AChord id={`${w}-${l}-c`}  ></AChord>
                                    )
                                    })
                                }
                            </p>
                        <p>
                        {words.map((word, index) => {
                            const w = index //word number
                            return (
                                <Word id={`${w}-${l}`} onClick={(ev) => handleWordClick(l, w)}> {word} </Word>
                            )
                        })
                    }</p></div>)})


                   


                   : <></>
                }
            
            </Lyrics>
        </LyricsWrapper>
        {/* <EditorWrapper>
            <EditorSubWrapper>
                <PomEditor/>
            </EditorSubWrapper>
        </EditorWrapper> */}
         <Modal
                isOpen={isOpen}
                onEscapeKeydown={toggleModal}
                role="dialog"
                aria-modal={true}
                aria-labelledby="modal-label"
                transparent={true}
                >
                      <FocusLock>
                        <ModalContainer>
                            <ModalHeader>
                                <ModalTitle>Chords</ModalTitle>
                            </ModalHeader>
                            <ModalBody>
                                <ChordBase>
                                   <h2> SELECT CHORD </h2>
                                </ChordBase>
                                <Chords>
                                <ChordsA>
                                    {
                                        keysA.map(key => {

                                            return (
                                                <Chord onClick={handleChordClick}>{key}</Chord>
                                                )
                                        })
                                    }
                                 </ChordsA>
                                 <ChordsB>
                                    {
                                        keysB.map(key => {

                                            return (
                                                <Chord onClick={handleChordClick}>{key}</Chord>
                                                )
                                        })
                                    }
                                 </ChordsB>
                                 </Chords>
                                 <Suffixes>
                                    {
                                        suffixes.map(suffix => {
                                            if (suffix === "major"){
                                                suffix = "maj"
                                            }
                                            if (suffix === "minor") {
                                                suffix = "min"


                                            }
                                            return (
                                                <Suffix onClick = {handleSuffixClick}>{suffix}</Suffix>
                                                )
                                        })
                                    }
                                 </Suffixes>
                                 <ModalFooter>
                                    <ChordSelected>
                                        {chosenRoot}
                                        {chosenSuffix}
                                    </ChordSelected>
                            
                                    <NoChord onClick={handleNC}>N.C. </NoChord>
                                    <OK onClick={handleOK}>OK</OK>
                                    
                                </ModalFooter>
                            </ModalBody>

                        </ModalContainer>
                      </FocusLock>
                </Modal>
        
    </Wrapper>
  )
}

const SongInfoBox = styled.div`
display:flex;
flex-direction: column;
align-items: center;
margin-top: 100px;
width: 200px;


`

const AlbumCover = styled.img`
width: 200px;
margin-top: 0%;
border: 1px solid black;
`

const SongInfoSubBox = styled.div`
background-color: var(--color-darkpurple);
width: 250px;
height: 310px;
display:flex;
flex-direction: column;
align-items: center;
border-radius: 30px;
justify-content: center;
position: absolute;
top: 100px;
left: 100px;
padding-bottom: 30px;
p, h1{
  color: white
}
`


const Title = styled.h1`
font-size: 17px;
margin-top: 10px;
color: white;
span {
  font-style: italic;
}
`

const NoChord = styled.button`
  background: var(--color-orange);
  display:flex;
justify-content: center;
font-size: 20px;
height: 50px;
width: 100px;
align-items: center;
margin-left: 70px !important;`

const AChord = styled.span`
color: var(--color-darkpurple);
&:hover {
color: var(--color-orange)
}`

const OK = styled.button`
display:flex;
justify-content: center;
font-size: 20px;
height: 50px;
width: 100px;
align-items: center;
margin-left: 70px !important;
background: linear-gradient(var(--color-deepteal), var(--color-darkpurple));
`

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
  justify-content: center;
  `

const ChordSelected = styled.div`
display:flex;
justify-content: center;
align-items: center;
border: 1px solid var(--color-orange);
bottom: 30px;
right: 500px;
height: 70px;
width: 400px;
background-color: var(--color-deepteal);
font-size: 40px;
`

const Suffix = styled.p`
margin-left: 10px;
  font-size: 20px;
  font-weight: 600;
  width: 20%;

    &:hover {
        color: var(--color-orange);
        cursor: pointer;
    }


`
const Suffixes = styled.div`
display: grid;
width: 70%;
height: auto;
padding-bottom: 10px;
flex-direction: row;
justify-content: center;


align-items: center;
margin-top: 50px;
border-bottom: 1px solid var(--color-orange); 
grid-template-columns: 1fr 1fr 1fr 1fr;
  padding: 1em;
  grid-row-gap: 1px;



`
const ChordsB = styled.div`
  display: flex;
  flex-direction: row;`
const ChordsA = styled.div`
  display: flex;
  flex-direction: row;`
const Chord = styled.button`


  margin-left: 10px;
  font-size: 28px;
  font-weight: 600;
  width: 20%;
  color: white;

    &:hover {
        color: var(--color-orange);
        cursor: pointer;
    }
    &:focus {
        color: var(--color-orange);
        font-size: 40px;
    }
`

const Chords = styled.ul`

display: flex;
width: auto;
padding-bottom: 10px;
flex-direction: column;
justify-content: center;
align-items: center;
margin-top: 50px;

border-bottom: 1px solid var(--color-orange);
/* margin: 0 auto;
list-style-type: none;
border: 1px solid red;
height: 20%; */


`
const ChordBase = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  font-size: 25px;
  width: 75%;

  h2 {
    border-bottom: 1px solid var(--color-orange);
    text-align: center;
    padding-bottom: 10px;
    
    width: 50%;
  }
`

const ModalBody = styled.div`
  display: flex;
  align-items: center;
  height:100%;
  width: 100%;
  flex-direction: column;
  position: relative;

  .active {
    color: var(--color-orange);
  }

`

const ModalContainer = styled.div`
width: 800px;
height: 800px;
position: relative;
border: 1px solid var(--color-orange);
background-color: var(--color-dark-grey);
`

const ModalTitle = styled.h1`
text-align: center;

`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid orange;
  background-color: var(--color-darkpurple);
  justify-content: space-between;`

const Annotate = styled.button`
color: var(--color-deepteal);
`

const SubHeader = styled.div`
`

const EditorSubWrapper = styled.div`
width: 600px;
border: 1px solid white;
height: 700px;
border: 1px solid red;
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
color: white;
&:hover {
color: var(--color-orange);
cursor: pointer;
}`

const Lyrics = styled.p`
white-space: pre-wrap;
margin-left: 300px;
margin-top: 100px;
line-height: 50px;
columns: 3;

`

const LyricsWrapper = styled.div`
height: 100vh;
align-items: center;
justify-content: center;

margin-top: -100px;

`

const Wrapper = styled.div`
display:flex;
flex-direction: column;
align-items: center;
justify-content: center;
position: relative;
left: 00px;
`

export default PeaceOfMusic