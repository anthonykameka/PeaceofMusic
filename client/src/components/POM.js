import React, { useEffect, useState, useContext , useRef} from 'react'
import { CurrentUserContext } from './CurrentUserContext'
import { PeaceContext } from './PeaceContext'
import Modal from 'styled-react-modal'
import FocusLock from 'react-focus-lock'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import chordsheetjs from 'chordsheetjs';
import ChordSheetJS from 'chordsheetjs';


const POM = () => {

    const [song, setSong] = useState(null) // this particular songs information 
    const [splitWords, setSplitWords] = useState(null) // split words used later
    const [splitLines, setSplitLines] = useState(null) // split lines
    const [pickingChord, setPickingChord] = useState(false) // when user is picking chord
    const [chosenRoot, setChosenRoot] = useState(null) // Root Chord chosen (Prefix of chord. ie : C, D , F# etc)
    const [chosenSuffix, setChosenSuffix] = useState(null) // suffix of chord chosen (sus, dim maj7 etc)
    const [selectedWordIndex, setSelectedWordIndex] = useState(null) // index of the word being selected 
    const [pomLyrics, setPomLyrics] = useState(null) //

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
            console.log(res.data)
            setSong(res.data) 
            setPomLyrics(res.data.thisSong.lyrics)
            setSplitLines(lineSeparator(res.data.thisSong.lyrics)) })// split lines of the lyrics into  individual, arrays // useful for determining the word's location within the lyrics.

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
        console.log(pom2)
        const pom3 = formatter.format(pom2)
        return pom3
    }
    let displayedLyrics = null
    if (pomLyrics) {
        displayedLyrics = pomFormatter(pomLyrics)
    }

    console.log(displayedLyrics)

    console.log(document.getElementsByClassName("lyrics"))

    //foreach the above to add and id for each line

    // const testPom = song?.thisSong.lyrics
    // const testPom2 = testPom?.replace(/\[/g, '{c: ').replace(/]/g, '}')
    //  console.log(testPom2)
    //  let testPom3 = null
    //  let disp2 = null
    //  if (testPom2) {
    //     testPom3 = proParser.parse(testPom2)
    //     disp2 = formatter.format(testPom3)
    //  }
    //  console.log(disp2)
    
    // // const disp2 = formatter.format(testPom3)
    // // console.log(disp2)
    


 // line separator. split at new lines..
 const lineSeparator = (text) => {
    const array = text.split("\n")
    return array
    
 }




// split the keys array [array of 12 keys] // split to aid with the styling
const keysA = keys?.slice(0, 6) 
const keysB = keys?.slice(6,12)


// initialize a list of suffixes.
let suffixes = music?.suffixes


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
     <>
    <Wrapper>
        <SongInfoBox>
        <SongInfoSubBox>
          <AlbumCover src={song?.thisSong.albumArt}/>
          <Title>{song?.songTitle}</Title>
          <Title><span>{song?.artistName}</span></Title>

        </SongInfoSubBox>
       
      </SongInfoBox>
      <LyricsWrapper>
      <TitleBox> 
                <Info>{}</Info>

            </TitleBox>
            <Lyrics>
                {
                    song?
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
                                    {
                                        words.map((word, index) => {
                                            const w = index //word number
                                            return (
                                                <Word id={`${w}-${l}`} onClick={(ev) => handleWordClick(l, w)}> {word} </Word>
                                            )
                                        })
                                    }
                                </p>
                            </div>
                        )
                        
                })
                : <></>
            }
           
            </Lyrics>

      </LyricsWrapper>
    </Wrapper>
    <Lyrics2Wrapper>
    {
        !song? <></>
       : <Lyrics2 dangerouslySetInnerHTML={{__html: displayedLyrics}}/>
    // : <></>



    }
    </Lyrics2Wrapper>
   </>
   
  )
}

const Lyrics2Wrapper = styled.div`
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
border: 1px solid red;
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

export default POM