import React, { useEffect, useState, useContext , useRef, useCallback} from 'react'
import { CurrentUserContext } from './CurrentUserContext'
import { PeaceContext } from './PeaceContext'
import Modal from 'styled-react-modal'
import FocusLock from 'react-focus-lock'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import chordsheetjs, { HtmlTableFormatter } from 'chordsheetjs';
import ChordSheetJS from 'chordsheetjs';


const POM2 = () => {

    const [song, setSong] = useState(null) // this particular songs information 
    const [pickingChord, setPickingChord] = useState(false) // when user is picking chord
    const [chosenRoot, setChosenRoot] = useState(null) // Root Chord chosen (Prefix of chord. ie : C, D , F# etc)
    const [chosenSuffix, setChosenSuffix] = useState(null) // suffix of chord chosen (sus, dim maj7 etc)
    const [selectedWordIndex, setSelectedWordIndex] = useState(null) // index of the word being selected 
    const [pomLyrics, setPomLyrics] = useState(null) //
    const songId = useParams().id; // params for the song 
    const [defaultChordPro, setDefaultChordPro] = useState(null) //]

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
            // console.log(res.data)
            setSong(res.data) 
            setPomLyrics(res.data.thisSong.lyrics)
            setDefaultChordPro(res.data.thisSong.lyrics.replace(/\[/g, '{c: ').replace(/]/g, '}'))
        })
    }, [])

    

// similar to lyrics reference function, the user will highlight section for musical education.




    const formatter = new ChordSheetJS.HtmlTableFormatter();
    const divFormatter = new ChordSheetJS.HtmlDivFormatter();
    const proParser = new ChordSheetJS.ChordProParser();
    const cowParser = new ChordSheetJS.ChordsOverWordsParser();
    const ugParser = new ChordSheetJS.UltimateGuitarParser();

   

    const pomFormatter = (lyrics) => {
        const pom1 = lyrics.replace(/\[/g, '{c: ').replace(/]/g, '}')
        const pom2 = proParser.parse(pom1)
        // console.log(pom2)
        const pom3 = formatter.format(pom2)
        // console.log(pom1, pom2, pom3)
        return pom3
    }
    let displayedLyrics = null
    let proParsedLyrics = null
    let commentedLyrics = null
    if (pomLyrics) {    
        displayedLyrics = pomFormatter(pomLyrics)
        commentedLyrics = pomLyrics.replace(/\[/g, '{c: ').replace(/]/g, '}')
        proParsedLyrics = proParser.parse(commentedLyrics)
        displayedLyrics = formatter.format(proParsedLyrics)
    }
    let POMSheet = null;



   
const htmlFormatter = (lyrics) => {
  const pro = proParser.parse(lyrics)
  const pom = formatter.format(pro)
  return pom
}
   if (pomLyrics) {
    displayedLyrics = htmlFormatter(defaultChordPro)
 }


const [selected, setSelected] = useState(null);

// split the keys array [array of 12 keys] // split to aid with the styling
const keysA = keys?.slice(0, 6) 
const keysB = keys?.slice(6,12)


// initialize a list of suffixes.
let suffixes = music?.suffixes

const [isOpen, setIsOpen] = useState(false); // initialize modal state


   //function to toggle modal
  const toggleModal = (word) => {
    setSelectedWordIndex(word)
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
// function to replace string at certain index








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


    


    document.addEventListener("selectionchange", event=> {
      let selection = document.getSelection() ? document.getSelection().toString() : document.selection.createRange().toString();
      // console.log(selection)
      // console.log(document.getSelection())
    })
    let defaultChordProClean = defaultChordPro?.replace(/\n\s*\n/g, '\n');

    const [chordsVisible, setChordsVisible] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [editButton, setEditButton] = useState("Edit")
    const [updatedLyrics, setUpdatedLyrics] = useState(null)
    const [updatedTableFormat, setUpdatedTableFormat] = useState(null)
    const [defaultSheet, setDefaultSheet] = useState(true)
    const [sheetWithChords, setSheetWithChords] = useState(null)
    const [updatedChordPro, setUpdatedChordPro] = useState(defaultChordPro?.replace(/\n\s*\n/g, '\n'))
    const [currentChordPro, setCurrentChordPro] = useState(null)
  

    useEffect(() => {

      if (updatedChordPro == null) {
        setUpdatedChordPro(defaultChordProClean)
      }
    
      if (editButton === 'Save') {
        console.log('Edit button clicked');
      } else if (editButton === 'Edit') {
        console.log('Save button clicked');
      
      }

      if (!defaultSheet && editMode) {

        if (updatedChordPro == defaultChordPro) {
          console.log("the default sheet has not changed1")
          console.log(updatedChordPro)
          setUpdatedTableFormat(displayedLyrics)
        console.log(defaultChordPro)
        } else {
          console.log("the default sheet has changed1")
        }

        
      } else if (defaultSheet && editMode) {
        console.log("test")
        console.log(updatedChordPro)
        console.log(defaultChordProClean)
   
          if (updatedChordPro == defaultChordProClean) {
            console.log("the default sheet has not changed2")
          } else {
            console.log("the default sheet has changed2")
          }
      } else if (defaultSheet & !editMode) {
        // const cuHtml = document.querySelector(".raw").innerText
        // console.log(cuHtml)
        if (updatedChordPro == defaultChordProClean) {
          console.log("the default sheet has not changed")
          setDefaultSheet(true)
          
        } else {
          console.log("the default sheet has changed")
          setDefaultSheet(false)
          setCurrentChordPro(updatedChordPro);
          const proParsed = proParser.parse(updatedChordPro)
          const tableFormat = formatter.format(proParsed)
          setUpdatedTableFormat(tableFormat)

        }

      } else if (!defaultSheet & !editMode ) {

        const proParsed = proParser.parse(updatedChordPro)
        const tableFormat = formatter.format(proParsed)
        setUpdatedTableFormat(tableFormat)
      }
    }, [editMode]);
  
    
    const handleEditMode = (ev) => {
      if (editButton === "Edit") {
        setEditButton("Save")
        setEditMode(!editMode)
      } else {
        setEditButton("Edit")
       
        setEditMode(!editMode)
      }
    }

    const handleViewChords = (ev) => {
      // console.log(chordsVisible)
      setChordsVisible(!chordsVisible)
      // console.log(chordsVisible)
    }

    const handleDefaultChange = (ev) => {
      ev.preventDefault();
      setUpdatedChordPro(ev.target.innerText)
      console.log(defaultChordPro)
      console.log(ev.target.innerText)
      if (ev.target.innerText == defaultChordPro) {
        console.log("the same")
      } else {
        console.log("not the same")
        setCurrentChordPro(updatedChordPro)
      }
    }

    const handleUpdatedChange = useCallback((ev) => {
      ev.preventDefault();
      setUpdatedChordPro(ev.target.innerText)
      console.log("changing...")
      console.log(ev.target.innerText)

      if (ev.target.innerText == defaultChordPro) {
        console.log("updated, but back to default")

      } else if (ev.target.innerText == currentChordPro) {
        console.log("no change from the latest version")
      } else {
        console.log("new update")
      }
    }, [])

  return (
     <>
    <Wrapper>
        <SongInfoBox>
        <SongInfoSubBox>
          <AlbumCover src={song?.thisSong.albumArt}/>
          <Title>{song?.songTitle}</Title>
          <Title><span>{song?.artistName}</span></Title>

        </SongInfoSubBox>
       
      </SongInfoBox>
      
    </Wrapper>
   
        
    <Lyrics2Wrapper>
      <ChordButtons>
        <AddChordButton onClick={handleEditMode}>{editButton}</AddChordButton>
        <ViewChords onClick={handleViewChords}>See Chords</ViewChords>
      </ChordButtons>
    {
        !song && keys? <></>
        : 
        <>
        {
          defaultSheet
          ? 
            editMode
              ? <Lyrics2 onInput={handleDefaultChange} className="raw" contentEditable={editMode} dangerouslySetInnerHTML={{__html:defaultChordPro}}/>
              : <Lyrics2 contentEditable={editMode} dangerouslySetInnerHTML={{__html: displayedLyrics}}/>
          
          : 
            !editMode
            ?<Lyrics2 contentEditable={editMode} dangerouslySetInnerHTML={{__html: updatedTableFormat}}/>
            : <Lyrics2  onBlur={handleUpdatedChange} className="raw" contentEditable={editMode} dangerouslySetInnerHTML={{__html: updatedChordPro }}/>
        }
        
        
        </>
    }
    

   
    </Lyrics2Wrapper>
    <ChordTable style={{display: chordsVisible ? "none": "block"  }}>
        <ModalContainer >
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
                                        keysA?.map(key => {

                                            return (
                                                <Chord onClick={handleChordClick}>{key}</Chord>
                                                )
                                        })
                                    }
                                 </ChordsA>
                                 <ChordsB>
                                    {
                                        keysB?.map(key => {

                                            return (
                                                <Chord onClick={handleChordClick}>{key}</Chord>
                                                )
                                        })
                                    }
                                 </ChordsB>
                                 </Chords>
                                 <FilterBox>
                                  <h1>Suffixes</h1>
                                  <ChordFilter>
                                      <Filter>All</Filter>
                                      <Filter>Maj</Filter>
                                      <Filter>Min</Filter>
                                      <Filter>Dominant7</Filter>
                                      <Filter>Slash</Filter>
                                      <Filter>Dim/HalfDim</Filter>
                                      <Filter>minmaj7</Filter>
                                    </ChordFilter>
                                  </FilterBox>
                                 <Suffixes>
                                 
                                    {
                                        suffixes?.map(suffix => {
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
                            
                                    {/* <NoChord onClick={handleNC}>N.C. </NoChord>
                                    <OK onClick={handleOK}>OK</OK> */}
                                    
                                </ModalFooter>
                            </ModalBody>

                        </ModalContainer>
        </ChordTable>
    
   </>
   
  )
}

const FilterBox = styled.div`
h1 {
  font-size: 20px;
  text-align: center;
  margin-top: 10px;
}
`

const ChordFilter = styled.ul`
display: flex;
border-bottom: 1px solid var(--color-deepteal);
`
const Filter = styled.li`
margin: 10px;
`

const ChordTable = styled.div`
height: 400px;
width: 400px;
position: fixed;
top: 25%;
right: 10%;
`

const AddChordButton = styled.button`
color: white;
border: 1px solid white;
margin-right: 10px;
`

const ChordButtons = styled.div`
display: flex;`

const Lyrics2Wrapper = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
white-space: pre-wrap;.

span {
    color: white;
    &:hover {
        color: var(--color-orange);
        cursor: pointer;
    }
}
`


const AChord = styled.span`
color: var(--color-darkpurple);
&:hover {
color: var(--color-orange)
}`

const Title = styled.h1`
font-size: 17px;
margin-top: 10px;
color: white;
span {
  font-style: italic;
}
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

const SongInfoBox = styled.div`
display:flex;
flex-direction: column;
align-items: center;
margin-top: 100px;
width: 200px;


`

const Info = styled.p`
`

const TitleBox = styled.div`
display:flex;
flex-direction: column;
`


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

const Lyrics2 = styled.div`
width: 400px;

font-family: "Source Sans Pro", sans-serif;
 .comment {
    font-weight: bold;
 }

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

const NoChord = styled.button`
  background: var(--color-orange);
  display:flex;
justify-content: center;
font-size: 20px;
height: 50px;
width: 100px;
align-items: center;
margin-left: 70px !important;`


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
  height: 140px;
  width: 200px;
  justify-content: center;
  `

const ChordSelected = styled.div`
display:flex;
justify-content: center;
align-items: center;
border: 1px solid var(--color-orange);
height: 40%;
width: 120%;
background-color: var(--color-deepteal);
font-size: 200%;
margin-bottom: 20px;
`

const Suffix = styled.p`
margin-left: 10px;
  font-size: 18px;
  font-weight: 600;
  width: 10%;

    &:hover {
        color: var(--color-orange);
        cursor: pointer;
    }


`
const Suffixes = styled.div`
display: grid;
width: 80%;
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

const ViewChords = styled.button`
color: white;
border: 1px solid white;
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
width: 500px;
height: 800px;

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


export default POM2