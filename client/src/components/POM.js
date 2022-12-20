import React, { useEffect, useState, useContext , useRef} from 'react'
import { CurrentUserContext } from './CurrentUserContext'
import { PeaceContext } from './PeaceContext'
import Modal from 'styled-react-modal'
import FocusLock from 'react-focus-lock'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import chordsheetjs from 'chordsheetjs';
import ChordSheetJS from 'chordsheetjs';
import { id } from 'date-fns/locale'


const POM = () => {

    const [song, setSong] = useState(null) // this particular songs information 
    const [splitWords, setSplitWords] = useState(null) // split words used later
    const [splitLines, setSplitLines] = useState(null) // split lines
    const [pickingChord, setPickingChord] = useState(false) // when user is picking chord
    const [chosenRoot, setChosenRoot] = useState(null) // Root Chord chosen (Prefix of chord. ie : C, D , F# etc)
    const [chosenSuffix, setChosenSuffix] = useState(null) // suffix of chord chosen (sus, dim maj7 etc)
    const [selectedWordIndex, setSelectedWordIndex] = useState(null) // index of the word being selected 
    const [pomLyrics, setPomLyrics] = useState(null) //
    const [pomSheet, setPomSheet] = useState(null) //
    const songId = useParams().id; // params for the song 

    



      const ChordSheetViewer = () => {

        const formatters = {
            html: chordsheetjs.HtmlDivFormatter,
            text: chordsheetjs.TextFormatter,
          };

      }

      const ChordSheetEditor = () => {



      }
    

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
            
        })
    }, [])

    

// similar to lyrics reference function, the user will highlight section for musical education.




const testSong = ` {title: Let it be}
    {artist: The Beatles}
    {Chorus}
      
    Let it [Am]be, let it [C/G]be, let it [F]be, let it [C]be
    [C]Whisper words of [G]wisdom, let it [F]be [C/E]   [Dm]   [C] `.substring(1);

    const formatter = new ChordSheetJS.HtmlTableFormatter();
    const proParser = new ChordSheetJS.ChordProParser();
    const cowParser = new ChordSheetJS.ChordsOverWordsParser();
    const ugParser = new ChordSheetJS.UltimateGuitarParser();
    const  [display, setDisplay] = useState(null)

    const pomFormatter = (lyrics) => {
        const pom1 = lyrics.replace(/\[/g, '{c: ').replace(/]/g, '}')
        const pom2 = proParser.parse(pom1)
        // console.log(pom2)
        const pom3 = formatter.format(pom2)
        return pom3
    }
    let displayedLyrics = null
    if (pomLyrics) {
        displayedLyrics = pomFormatter(pomLyrics)
    }
    let POMSheet = null;

    // console.log(displayedLyrics)

    const lines = document.getElementsByClassName("lyrics")
   

    setTimeout(() => {
        for (let i = 0; i < lines.length; i++) {
        
            const line = lines[i]
            // line.id =  "l-" + i;
       
            line.innerHTML = `<p id=l-${i}> ${line.textContent}</p>`
            
            let words = line.textContent.split(" ").filter(word => word.length > 0)
            line.textContent = ""
             
            words.forEach((word, index) => {
                const wordLink = document.createElement("span")
                wordLink.id = `w-${index} l-${i}`
                wordLink.className= "word"
                wordLink.textContent = `${word} `
                wordLink.addEventListener("click", handleWord);
                line.append(wordLink)
            })

        }
            // })}
    }, 200)

  
const handleWord = (ev) => {
    toggleModal()
    ev.preventDefault()
    let rawIndexes = null
    console.log(ev.target.id)
    let indexes = (ev.target.id.split(" "))
    console.log(indexes)
    let lineIndex = indexes[1].slice(2)
    console.log(lineIndex)
    let wordIndex = indexes[0].slice(2)
    console.log(document.getElementById(ev.target.id))
    console.log(wordIndex)
    setSelectedWordIndex([lineIndex, wordIndex])
    console.log(selectedWordIndex)
    // console.log(pomLyrics)
    
        
}


 



// split the keys array [array of 12 keys] // split to aid with the styling
const keysA = keys?.slice(0, 6) 
const keysB = keys?.slice(6,12)


// initialize a list of suffixes.
let suffixes = music?.suffixes


// word click.
//see the return of the component. // each word is given a line number and a word number within that that line. A matrix to save and recall //
// although the saving is not functional as of yet, it will aid in storing and analysing the harmonic data. The first word of a line uses the ONE chord. 67% of the time.

const handleWordClick = (ev) => {
    
    setSelectedWordIndex()
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
// function to replace string at certain index
const replaceAt = (source, index, replacement) => {
    return source.substring(0, index) + replacement + source.substring(index + replacement.length) + " ";
}

// handle OK click

const [savedSheet, setSavedSheet] = useState(null)
const [refreshPom, setRefreshPom] = useState(true)
// console.log(savedSheet)

const handleOK =(ev) => {
    ev.preventDefault()
    setPickingChord(false) // user is done picking chord

    

    const chosenChord = (chosenRoot+chosenSuffix) // attach prefix and suffix together.
    const indexAndChord = [chosenRoot+chosenSuffix, selectedWordIndex] //unused at this time.
    const thisWord = selectedWordIndex[1] // get Word, within line
    const thisLine = selectedWordIndex[0] // get Line, within lyrics
  
    let currentSheet = null
    if (savedSheet) {
        currentSheet = savedSheet
    }
    else {
        currentSheet = pomLyrics
    }


    let currentSheetLines = currentSheet.split(/\r?\n/)
    let currentSheetLinesWithoutComments = currentSheetLines.filter(line => !line.includes("[Chorus") || !line.includes("[Verse") || !line.includes("[Intro"))
    console.log(currentSheetLines)
    console.log(currentSheetLinesWithoutComments)
    let currentSheetLinesWithoutSpaces = currentSheetLinesWithoutComments.filter(line => line.length>0)
    let currentLine = currentSheetLinesWithoutSpaces[thisLine]
    // console.log(currentLine)
    // console.log(currentSheetLines)
    let currentLineWords = currentLine.split(" ")
    // console.log(currentLineWords)
    let currentWord = currentLineWords[thisWord]
    // console.log(currentWord)
    let newWord = `[${chosenChord}]${currentWord}`
    // console.log(newWord)
    currentLineWords[thisWord] = newWord
    // console.log(currentLineWords)
    let newLine = currentLineWords.join(" ")
    // console.log(newLine)
    currentSheetLines[thisLine] = newLine
    let newSheet = currentSheetLines.join("\n")
    // console.log(newSheet)
    setSavedSheet(newSheet)
    // console.log(savedSheet)
    let newParsedSheet = proParser.parse(newSheet)
    displayedLyrics = formatter.format(newParsedSheet)
    // console.log(displayedLyrics)
    setPomSheet(displayedLyrics)

    // const element = document.getElementById(`${thisWord}-${thisLine}-c`) // find the element by id that matches corresponding matrix value.

    // element.innerText = `${chosenChord}` // the element which is above the chosen word, is given text
    setSelectedWordIndex(null) // reset everything
    setChosenRoot("")
    setChosenSuffix("")
    setRefreshPom(!refreshPom) //
    toggleModal()
}

useEffect(() => {
    setSavedSheet(savedSheet)

}, [refreshPom])
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
        
    <Lyrics2Wrapper>
    {
        !song? <></>
       : pomSheet
       ? <Lyrics2 dangerouslySetInnerHTML={{__html: pomSheet}}/>
       : <Lyrics2 dangerouslySetInnerHTML={{__html: displayedLyrics}}/>
        
        
    // : <></>



    }
    </Lyrics2Wrapper>
   </>
   
  )
}

const Lyrics2Wrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;

span {
    color: white;
    &:hover {
        color: var(--color-orange)
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


export default POM